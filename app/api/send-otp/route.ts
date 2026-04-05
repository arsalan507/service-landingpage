import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/otp';

// Rate limit: max 3 OTP sends per phone per 10 minutes
const otpSendLimit = new Map<string, { count: number; resetAt: number }>();
const OTP_SEND_LIMIT = 3;
const OTP_SEND_WINDOW = 10 * 60 * 1000; // 10 min

function isOtpLimited(phone: string): boolean {
  const now = Date.now();
  const entry = otpSendLimit.get(phone);
  if (!entry || entry.resetAt < now) {
    otpSendLimit.set(phone, { count: 1, resetAt: now + OTP_SEND_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > OTP_SEND_LIMIT;
}

export async function POST(request: NextRequest) {
  // CSRF: require Origin header from allowed domains
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://getservice.2xg.in',
    'http://localhost:3000',
  ].filter(Boolean);
  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { phone } = await request.json();

    // Validate Indian mobile number
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { success: false, message: 'Enter a valid Indian mobile number (starts with 6-9, 10 digits)' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '');

    // Per-phone rate limit
    if (isOtpLimited(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: 'Too many OTP requests. Please wait 10 minutes.' },
        { status: 429 }
      );
    }

    const result = await sendOTP(cleanPhone);
    if (!result.success) {
      console.error('[send-otp] failed:', result.error);
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send OTP. Try again.' },
        { status: 500 }
      );
    }

    console.log('[send-otp] sent to:', cleanPhone.slice(-4));
    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('[send-otp] error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Try again.' },
      { status: 500 }
    );
  }
}
