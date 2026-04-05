import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, resendOTP, createVerificationToken } from '@/lib/otp';

export async function POST(request: NextRequest) {
  // CSRF check
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
    const { phone, otp, action } = await request.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '');

    // Handle resend
    if (action === 'resend') {
      const result = await resendOTP(cleanPhone);
      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.error || 'Failed to resend OTP' },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, message: 'OTP resent' });
    }

    // Verify OTP
    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'Enter a valid 6-digit OTP' },
        { status: 400 }
      );
    }

    const result = await verifyOTP(cleanPhone, otp);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // OTP verified — issue a signed token (valid 15 min)
    const token = createVerificationToken(cleanPhone);
    if (!token) {
      console.error('[verify-otp] OTP_SECRET not configured — cannot issue token');
      return NextResponse.json(
        { success: false, message: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    console.log('[verify-otp] verified:', cleanPhone.slice(-4));
    return NextResponse.json({ success: true, verificationToken: token });
  } catch (err) {
    console.error('[verify-otp] error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Try again.' },
      { status: 500 }
    );
  }
}
