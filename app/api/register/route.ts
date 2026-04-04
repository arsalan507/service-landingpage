import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Server-side only — service role key never exposed to browser
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || 'https://service.2xg.in',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

// Slugs that would collide with app routes or look official
const RESERVED_SLUGS = new Set([
  'admin', 'api', 'login', 'signup', 'register', 'dashboard',
  'app', 'www', 'help', 'support', 'billing', 'settings',
  'auth', 'oauth', 'callback', 'webhook', 'webhooks',
  'static', 'assets', 'public', 'health', 'status',
]);

// Simple in-memory rate limiter (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max signups per IP per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

/** Generate a clean slug from any string */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Find a unique slug — appends -2, -3, etc. if base is taken */
async function findUniqueSlug(baseSlug: string): Promise<string> {
  // Check the base slug first
  const { data: existing } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('slug', baseSlug)
    .eq('is_active', true)
    .maybeSingle();
  if (!existing) return baseSlug;

  // Try suffixed versions: slug-2, slug-3, ... up to slug-20
  for (let i = 2; i <= 20; i++) {
    const candidate = `${baseSlug}-${i}`;
    const { data } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('slug', candidate)
      .eq('is_active', true)
      .maybeSingle();
    if (!data) return candidate;
  }
  // Fallback: append random 4-char suffix
  return `${baseSlug}-${crypto.randomBytes(2).toString('hex')}`;
}

/** Find a unique short_code — appends 1, 2, etc. if base is taken */
async function findUniqueShortCode(baseName: string): Promise<string> {
  const baseCode = baseName.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase() || 'SHOP';

  const { data: existing } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('short_code', baseCode)
    .eq('is_active', true)
    .maybeSingle();
  if (!existing) return baseCode;

  // Try suffixed: TEST1, TEST2, ... up to TEST99
  for (let i = 1; i <= 99; i++) {
    const candidate = `${baseCode}${i}`;
    const { data } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('short_code', candidate)
      .eq('is_active', true)
      .maybeSingle();
    if (!data) return candidate;
  }
  // Fallback: random 4-char code
  return crypto.randomBytes(2).toString('hex').toUpperCase();
}

function verifyRazorpayPayment(paymentId: string, orderId: string, signature: string): boolean {
  if (!RAZORPAY_KEY_SECRET) return true; // Skip in test mode if no secret
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'rate_limit', field: null, message: 'Too many attempts. Please wait before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      orgName, orgSlug, orgPhone, orgAddress,
      ownerName, ownerEmail, ownerPassword, ownerPhone,
      planType, razorpayPaymentId, razorpayOrderId, razorpaySignature,
    } = body;

    console.log('[register] incoming:', { orgName, orgSlug, ownerEmail, planType });

    // --- Validate required fields ---
    if (!orgName || orgName.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'validation', field: 'shopName', message: 'Shop name must be at least 2 characters' }, { status: 400 });
    }
    if (!ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json({ success: false, error: 'validation', field: null, message: 'Name, email, and password are required' }, { status: 400 });
    }
    // Password strength: same 5-criteria scoring as frontend, require >= 3
    {
      let score = 0;
      if (ownerPassword.length >= 8) score++;
      if (/[A-Z]/.test(ownerPassword)) score++;
      if (/[a-z]/.test(ownerPassword)) score++;
      if (/[0-9]/.test(ownerPassword)) score++;
      if (/[^A-Za-z0-9]/.test(ownerPassword)) score++;
      if (score < 3) {
        return NextResponse.json({ success: false, error: 'validation', field: 'password', message: 'Password too weak. Use 8+ characters with uppercase, lowercase, number, and special character.' }, { status: 400 });
      }
    }
    if (ownerPhone && !/^[6-9]\d{9}$/.test(ownerPhone.replace(/\D/g, ''))) {
      return NextResponse.json({ success: false, error: 'validation', field: 'phone', message: 'Enter a valid Indian mobile number (starts with 6-9)' }, { status: 400 });
    }
    if (!['free', 'pro'].includes(planType)) {
      return NextResponse.json({ success: false, error: 'validation', field: null, message: 'Invalid plan type' }, { status: 400 });
    }

    // --- Generate and validate slug ---
    const baseSlug = generateSlug(orgSlug || orgName);
    if (!baseSlug || baseSlug.length < 2) {
      return NextResponse.json({ success: false, error: 'validation', field: 'shopName', message: 'Shop name must contain at least 2 letters or numbers' }, { status: 400 });
    }
    if (RESERVED_SLUGS.has(baseSlug)) {
      return NextResponse.json({ success: false, error: 'slug_reserved', field: 'shopName', message: `"${orgName}" is a reserved name. Please choose a different shop name.` }, { status: 409 });
    }

    // --- Find unique slug (auto-suffix if taken) ---
    const slug = await findUniqueSlug(baseSlug);
    console.log('[register] slug resolved:', { baseSlug, finalSlug: slug });

    // --- Find unique short_code (auto-suffix if taken) ---
    const shortCode = await findUniqueShortCode(orgName);
    console.log('[register] shortCode resolved:', shortCode);

    // --- Verify Razorpay payment for pro plan ---
    if (planType === 'pro') {
      if (!razorpayPaymentId) {
        return NextResponse.json({ success: false, error: 'payment_required', field: null, message: 'Payment ID required for Pro plan' }, { status: 400 });
      }
      if (razorpayOrderId && razorpaySignature) {
        if (!verifyRazorpayPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature)) {
          return NextResponse.json({ success: false, error: 'payment_failed', field: null, message: 'Payment verification failed' }, { status: 400 });
        }
      }
    }

    // --- Check email uniqueness ---
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', ownerEmail.toLowerCase())
      .maybeSingle();
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'email_taken', field: 'email', message: 'This email is already registered. Please login instead.' }, { status: 409 });
    }

    // 1. Create auth user via admin API (proper GoTrue flow)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ownerEmail.toLowerCase(),
      password: ownerPassword,
      email_confirm: true,
      user_metadata: { name: ownerName },
    });
    if (authError || !authData.user) {
      const msg = authError?.message || '';
      console.error('[register] auth error:', msg);
      if (msg.toLowerCase().includes('already been registered')) {
        return NextResponse.json({ success: false, error: 'email_taken', field: 'email', message: 'This email is already registered. Please login instead.' }, { status: 409 });
      }
      return NextResponse.json({ success: false, error: 'auth_failed', field: null, message: 'Failed to create account. Please try again.' }, { status: 500 });
    }

    const authUserId = authData.user.id;

    // 2. Set plan limits
    const planLimits = planType === 'pro'
      ? { max_mechanics: 5, max_jobs_per_month: 9999, storage_limit_mb: 2000, plan_expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }
      : { max_mechanics: 2, max_jobs_per_month: 20, storage_limit_mb: 100, plan_expires_at: null };

    // 3. Create organization (slug + short_code are guaranteed unique at this point)
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: orgName.trim(),
        slug,
        short_code: shortCode,
        phone: orgPhone || null,
        address: orgAddress || null,
        plan_type: planType,
        ...planLimits,
        whatsapp_enabled: true,
        is_active: true,
      })
      .select('id')
      .single();

    if (orgError || !orgData) {
      // Rollback: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
      console.error('[register] org creation failed:', orgError?.message);
      return NextResponse.json({ success: false, error: 'org_failed', field: null, message: 'Failed to create shop. Please try again.' }, { status: 500 });
    }

    // 4. Create owner user
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        name: ownerName.trim(),
        email: ownerEmail.toLowerCase(),
        phone: ownerPhone || null,
        role: 'owner',
        org_id: orgData.id,
        auth_user_id: authUserId,
        avatar: '🏪',
        color: '#3B82F6',
        is_active: true,
      });

    if (userError) {
      // Rollback: delete org + auth user
      await supabaseAdmin.from('organizations').delete().eq('id', orgData.id);
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
      console.error('[register] user creation failed:', userError.message);
      return NextResponse.json({ success: false, error: 'user_failed', field: null, message: 'Failed to create account. Please try again.' }, { status: 500 });
    }

    // 5. Log billing if pro plan
    if (planType === 'pro' && razorpayPaymentId) {
      await supabaseAdmin.from('billing_logs').insert({
        org_id: orgData.id,
        amount: 249,
        plan_type: 'pro',
        payment_method: 'Razorpay',
        payment_date: new Date().toISOString().substring(0, 10),
        notes: `First month offer. Payment ID: ${razorpayPaymentId}`,
      }).catch(() => {});
    }

    // 6. Log activity
    await supabaseAdmin.from('activity_logs').insert({
      user_name: ownerName,
      user_email: ownerEmail,
      org_name: orgName,
      action: 'self_register',
      details: `Self-signup from landing page. Plan: ${planType}. Slug: ${slug}${razorpayPaymentId ? '. Razorpay: ' + razorpayPaymentId : ''}`,
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
      { success: false, error: 'server_error', field: null, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
