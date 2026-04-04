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
        { success: false, error: 'Too many attempts. Please wait 2-3 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      orgName, orgSlug, orgShortCode, orgPhone, orgAddress,
      ownerName, ownerEmail, ownerPassword, ownerPhone,
      planType, razorpayPaymentId, razorpayOrderId, razorpaySignature,
    } = body;

    // Validate required fields
    if (!orgName || orgName.length < 2) {
      return NextResponse.json({ success: false, error: 'Shop name is too short' }, { status: 400 });
    }
    if (!ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }
    if (ownerPassword.length < 8 || !/[A-Z]/.test(ownerPassword) || !/[0-9]/.test(ownerPassword)) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters with an uppercase letter and a number' }, { status: 400 });
    }
    if (ownerPhone && !/^[6-9]\d{9}$/.test(ownerPhone.replace(/\D/g, ''))) {
      return NextResponse.json({ success: false, error: 'Enter a valid Indian mobile number (starts with 6-9)' }, { status: 400 });
    }
    if (!['free', 'pro'].includes(planType)) {
      return NextResponse.json({ success: false, error: 'Invalid plan type' }, { status: 400 });
    }

    const slug = (orgSlug || orgName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const shortCode = (orgShortCode || orgName.replace(/[^A-Za-z]/g, '').substring(0, 4)).toUpperCase();

    // Verify Razorpay payment for pro plan
    if (planType === 'pro') {
      if (!razorpayPaymentId) {
        return NextResponse.json({ success: false, error: 'Payment ID required for Pro plan' }, { status: 400 });
      }
      // Verify signature if order-based checkout was used
      if (razorpayOrderId && razorpaySignature) {
        if (!verifyRazorpayPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature)) {
          return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
        }
      }
    }

    // Check slug uniqueness
    const { data: existingOrg } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (existingOrg) {
      return NextResponse.json({ success: false, error: 'This URL slug is already taken. Try a different shop name.' }, { status: 409 });
    }

    // Check email uniqueness
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUsers?.users?.some(u => u.email === ownerEmail.toLowerCase());
    if (emailExists) {
      return NextResponse.json({ success: false, error: 'This email is already registered. Please login instead.' }, { status: 409 });
    }

    // 1. Create auth user via admin API (proper GoTrue flow)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ownerEmail.toLowerCase(),
      password: ownerPassword,
      email_confirm: true,
      user_metadata: { name: ownerName },
    });
    if (authError || !authData.user) {
      return NextResponse.json({ success: false, error: authError?.message || 'Failed to create account' }, { status: 500 });
    }

    const authUserId = authData.user.id;

    // 2. Set plan limits
    const planLimits = planType === 'pro'
      ? { max_mechanics: 5, max_jobs_per_month: 9999, storage_limit_mb: 2000, plan_expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }
      : { max_mechanics: 2, max_jobs_per_month: 20, storage_limit_mb: 100, plan_expires_at: null };

    // 3. Create organization
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: orgName,
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
      const raw = (orgError?.message || '').toLowerCase();
      let friendlyMsg = 'Failed to create organization. Please try again.';
      if (raw.includes('unique constraint') && raw.includes('short_code')) friendlyMsg = 'This shop code is already taken. Try a different one.';
      else if (raw.includes('unique constraint') && raw.includes('slug')) friendlyMsg = 'This shop URL is already taken. Try a different shop name.';
      else if (raw.includes('unique constraint')) friendlyMsg = 'A shop with this name already exists. Try a different name.';
      return NextResponse.json({ success: false, error: friendlyMsg }, { status: 409 });
    }

    // 4. Create owner user
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        name: ownerName,
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
      return NextResponse.json({ success: false, error: userError.message || 'Failed to create owner' }, { status: 500 });
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
      }).catch(() => {
        // billing_logs table might not exist yet — don't fail signup
      });
    }

    // 6. Log activity
    await supabaseAdmin.from('activity_logs').insert({
      user_name: ownerName,
      user_email: ownerEmail,
      org_name: orgName,
      action: 'self_register',
      details: `Self-signup from landing page. Plan: ${planType}${razorpayPaymentId ? '. Razorpay: ' + razorpayPaymentId : ''}`,
    }).catch(() => {
      // activity_logs table might not exist yet — don't fail signup
    });

    return NextResponse.json({
      success: true,
      org_id: orgData.id,
      org_slug: slug,
      plan_type: planType,
    });

  } catch (err) {
    console.error('[register] error:', err);
    const raw = err instanceof Error ? err.message : '';
    const lower = raw.toLowerCase();
    let msg = 'Something went wrong. Please try again.';
    if (lower.includes('unique constraint') && lower.includes('short_code')) msg = 'This shop code is already taken. Try a different one.';
    else if (lower.includes('unique constraint') && lower.includes('slug')) msg = 'This shop URL is already taken. Try a different shop name.';
    else if (lower.includes('unique constraint')) msg = 'A shop with this name already exists. Try a different name.';
    else if (lower.includes('network') || lower.includes('fetch')) msg = 'Network error. Check your connection and try again.';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
