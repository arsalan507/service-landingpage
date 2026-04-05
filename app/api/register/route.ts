import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { validateVerificationToken } from '@/lib/otp';
import { RESERVED_SLUGS } from '@/lib/constants';

// --- Lazy Supabase client — only created when env vars are present ---
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _supabaseAdmin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return _supabaseAdmin;
}

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// --- Helpers ---

/** Generate a clean slug from any string */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Find a unique slug using a SINGLE batch query instead of sequential lookups.
 * Fetches all existing slugs matching the pattern, then picks the first available.
 */
async function findUniqueSlug(baseSlug: string, supabaseAdmin: ReturnType<typeof createClient>): Promise<string> {
  const { data: existing } = await supabaseAdmin
    .from('organizations')
    .select('slug')
    .like('slug', `${baseSlug}%`)
    .eq('is_active', true);

  const taken = new Set(existing?.map(r => r.slug) || []);

  if (!taken.has(baseSlug)) return baseSlug;
  for (let i = 2; i <= 100; i++) {
    const candidate = `${baseSlug}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${baseSlug}-${crypto.randomBytes(3).toString('hex')}`;
}

/**
 * Find a unique short_code using a SINGLE batch query.
 */
async function findUniqueShortCode(baseName: string, supabaseAdmin: ReturnType<typeof createClient>): Promise<string> {
  const baseCode = baseName.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase() || 'SHOP';

  const { data: existing } = await supabaseAdmin
    .from('organizations')
    .select('short_code')
    .like('short_code', `${baseCode}%`)
    .eq('is_active', true);

  const taken = new Set(existing?.map(r => r.short_code) || []);

  if (!taken.has(baseCode)) return baseCode;
  for (let i = 1; i <= 99; i++) {
    const candidate = `${baseCode}${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return crypto.randomBytes(2).toString('hex').toUpperCase();
}

function verifyRazorpaySignature(paymentId: string, orderId: string, signature: string): boolean {
  if (!RAZORPAY_KEY_SECRET) return false; // Fail closed
  const body = orderId + '|' + paymentId;
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(body).digest('hex');
  return expected === signature;
}

/** Password strength: same 5-criteria scoring as frontend, require >= 3 */
function isPasswordStrong(pw: string): boolean {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score >= 3;
}

// --- Main handler ---

export async function POST(request: NextRequest) {
  // CSRF: verify origin
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://getservice.2xg.in',
    'http://localhost:3000',
  ].filter(Boolean);
  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json({ success: false, error: 'forbidden', message: 'Forbidden' }, { status: 403 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error('[register] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
    return NextResponse.json({ success: false, error: 'config', message: 'Server configuration error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      orgName, orgSlug, orgPhone, orgAddress,
      ownerName, ownerEmail, ownerPassword, ownerPhone,
      planType, razorpayPaymentId, razorpayOrderId, razorpaySignature,
      verificationToken,
    } = body;

    console.log('[register] incoming:', { orgName, ownerEmail, planType, hasToken: !!verificationToken });

    // --- Step 1: Validate OTP verification token ---
    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: 'otp_required', field: 'phone', message: 'Phone verification is required. Please verify your phone number first.' },
        { status: 401 }
      );
    }

    const verifiedPhone = validateVerificationToken(verificationToken);
    if (!verifiedPhone) {
      return NextResponse.json(
        { success: false, error: 'otp_expired', field: 'phone', message: 'Phone verification expired. Please verify again.' },
        { status: 401 }
      );
    }

    // Ensure submitted phone matches verified phone
    const submittedPhone = (ownerPhone || '').replace(/\D/g, '');
    if (submittedPhone !== verifiedPhone) {
      return NextResponse.json(
        { success: false, error: 'phone_mismatch', field: 'phone', message: 'Phone number does not match verified number.' },
        { status: 400 }
      );
    }

    // --- Step 2: Validate inputs ---
    if (!orgName || orgName.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'validation', field: 'shopName', message: 'Shop name must be at least 2 characters' }, { status: 400 });
    }
    if (!ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json({ success: false, error: 'validation', field: null, message: 'Name, email, and password are required' }, { status: 400 });
    }
    if (!isPasswordStrong(ownerPassword)) {
      return NextResponse.json({ success: false, error: 'validation', field: 'password', message: 'Password too weak. Use 8+ characters with uppercase, lowercase, number, and special character.' }, { status: 400 });
    }
    if (!['free', 'pro'].includes(planType)) {
      return NextResponse.json({ success: false, error: 'validation', field: null, message: 'Invalid plan type' }, { status: 400 });
    }

    // --- Step 3: Generate and validate slug ---
    const baseSlug = generateSlug(orgSlug || orgName);
    if (!baseSlug || baseSlug.length < 3) {
      return NextResponse.json({ success: false, error: 'validation', field: 'shopName', message: 'Shop name must produce a valid URL (at least 3 letters/numbers)' }, { status: 400 });
    }
    if (RESERVED_SLUGS.has(baseSlug)) {
      return NextResponse.json({ success: false, error: 'slug_reserved', field: 'shopName', message: `"${orgName}" is a reserved name. Please choose a different shop name.` }, { status: 409 });
    }

    // --- Step 4: Verify Razorpay payment for pro plan ---
    if (planType === 'pro') {
      if (!razorpayPaymentId) {
        return NextResponse.json({ success: false, error: 'payment_required', message: 'Payment is required for Pro plan' }, { status: 400 });
      }
      if (!RAZORPAY_KEY_SECRET) {
        console.error('[register] RAZORPAY_KEY_SECRET not set — cannot verify payment');
        return NextResponse.json({ success: false, error: 'payment_config', message: 'Payment system not configured. Please contact support.' }, { status: 500 });
      }
      if (razorpayOrderId && razorpaySignature) {
        if (!verifyRazorpaySignature(razorpayPaymentId, razorpayOrderId, razorpaySignature)) {
          return NextResponse.json({ success: false, error: 'payment_failed', message: 'Payment verification failed' }, { status: 400 });
        }
      }
    }

    // --- Step 5: Resolve unique slug + short_code (batch queries) ---
    const [slug, shortCode] = await Promise.all([
      findUniqueSlug(baseSlug, supabaseAdmin),
      findUniqueShortCode(orgName, supabaseAdmin),
    ]);
    console.log('[register] resolved:', { slug, shortCode });

    // --- Step 6: Check email uniqueness ---
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', ownerEmail.toLowerCase())
      .maybeSingle();
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'email_taken', field: 'email', message: 'This email is already registered. Please login instead.' }, { status: 409 });
    }

    // --- Step 7: Create auth user ---
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ownerEmail.toLowerCase(),
      password: ownerPassword,
      email_confirm: true,
      user_metadata: { name: ownerName.trim() },
    });
    if (authError || !authData.user) {
      const msg = authError?.message || '';
      console.error('[register] auth error:', msg);
      if (msg.toLowerCase().includes('already been registered')) {
        return NextResponse.json({ success: false, error: 'email_taken', field: 'email', message: 'This email is already registered. Please login instead.' }, { status: 409 });
      }
      return NextResponse.json({ success: false, error: 'auth_failed', message: 'Failed to create account. Please try again.' }, { status: 500 });
    }
    const authUserId = authData.user.id;

    // --- Step 8: Create org + user (with rollback on failure) ---
    const planLimits = planType === 'pro'
      ? { max_mechanics: 5, max_jobs_per_month: 9999, storage_limit_mb: 2000, plan_expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }
      : { max_mechanics: 2, max_jobs_per_month: 20, storage_limit_mb: 100, plan_expires_at: null };

    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: orgName.trim(),
        slug,
        short_code: shortCode,
        phone: verifiedPhone,
        address: orgAddress || null,
        plan_type: planType,
        ...planLimits,
        whatsapp_enabled: true,
        is_active: true,
      })
      .select('id')
      .single();

    if (orgError || !orgData) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId).catch(e => console.error('[register] rollback auth failed:', e));
      console.error('[register] org creation failed:', orgError?.message);
      return NextResponse.json({ success: false, error: 'org_failed', message: 'Failed to create shop. Please try again.' }, { status: 500 });
    }

    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        name: ownerName.trim(),
        email: ownerEmail.toLowerCase(),
        phone: verifiedPhone,
        role: 'owner',
        org_id: orgData.id,
        auth_user_id: authUserId,
        avatar: '🏪',
        color: '#3B82F6',
        is_active: true,
      });

    if (userError) {
      // Rollback: delete org + auth user
      await Promise.all([
        supabaseAdmin.from('organizations').delete().eq('id', orgData.id).catch(e => console.error('[register] rollback org failed:', e)),
        supabaseAdmin.auth.admin.deleteUser(authUserId).catch(e => console.error('[register] rollback auth failed:', e)),
      ]);
      console.error('[register] user creation failed:', userError.message);
      return NextResponse.json({ success: false, error: 'user_failed', message: 'Failed to create account. Please try again.' }, { status: 500 });
    }

    // --- Step 9: Non-critical logging (fire and forget) ---
    if (planType === 'pro' && razorpayPaymentId) {
      supabaseAdmin.from('billing_logs').insert({
        org_id: orgData.id,
        amount: 249,
        plan_type: 'pro',
        payment_method: 'Razorpay',
        payment_date: new Date().toISOString().substring(0, 10),
        notes: `First month offer. Payment ID: ${razorpayPaymentId}`,
      }).catch(() => {});
    }

    supabaseAdmin.from('activity_logs').insert({
      user_name: ownerName,
      user_email: ownerEmail,
      org_name: orgName,
      action: 'self_register',
      details: `Self-signup. Plan: ${planType}. Slug: ${slug}. Phone verified.${razorpayPaymentId ? ' Razorpay: ' + razorpayPaymentId : ''}`,
    }).catch(() => {});

    console.log('[register] success:', { slug, shortCode, planType });

    return NextResponse.json({
      success: true,
      org_id: orgData.id,
      org_slug: slug,
      plan_type: planType,
    });
  } catch (err) {
    console.error('[register] unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
