import crypto from 'crypto';

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || '';
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || '';

// OTP_SECRET must be set in production — used to sign verification tokens
const OTP_SECRET = process.env.OTP_SECRET;
if (!OTP_SECRET) {
  console.error('[otp] FATAL: OTP_SECRET not set — token signing will fail');
}

if (!MSG91_AUTH_KEY) console.warn('[otp] MSG91_AUTH_KEY not set — OTP will fail');

/** Send OTP via MSG91 */
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID) {
    return { success: false, error: 'OTP service not configured' };
  }

  const res = await fetch('https://control.msg91.com/api/v5/otp', {
    method: 'POST',
    headers: {
      'authkey': MSG91_AUTH_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mobile: `91${phone}`,
      template_id: MSG91_TEMPLATE_ID,
      otp_length: 6,
    }),
  });

  const data = await res.json();
  if (data.type === 'success') {
    return { success: true };
  }
  return { success: false, error: data.message || 'Failed to send OTP' };
}

/** Verify OTP via MSG91 */
export async function verifyOTP(phone: string, otp: string): Promise<{ success: boolean; error?: string }> {
  if (!MSG91_AUTH_KEY) {
    return { success: false, error: 'OTP service not configured' };
  }

  const res = await fetch(
    `https://control.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${otp}`,
    { headers: { 'authkey': MSG91_AUTH_KEY } }
  );

  const data = await res.json();
  if (data.type === 'success') {
    return { success: true };
  }
  return { success: false, error: data.message || 'Invalid OTP' };
}

/** Resend OTP via MSG91 */
export async function resendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  if (!MSG91_AUTH_KEY) {
    return { success: false, error: 'OTP service not configured' };
  }

  const res = await fetch('https://control.msg91.com/api/v5/otp/retry', {
    method: 'POST',
    headers: {
      'authkey': MSG91_AUTH_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mobile: `91${phone}`,
      retrytype: 'text',
    }),
  });

  const data = await res.json();
  if (data.type === 'success') {
    return { success: true };
  }
  return { success: false, error: data.message || 'Failed to resend OTP' };
}

/**
 * Create a signed verification token after OTP is verified.
 * Contains phone + timestamp, HMAC-signed. Valid for 15 minutes.
 */
export function createVerificationToken(phone: string): string | null {
  if (!OTP_SECRET) return null;
  const payload = JSON.stringify({ phone, ts: Date.now() });
  const b64 = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', OTP_SECRET).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

/**
 * Validate a verification token. Returns phone if valid, null if expired/tampered.
 */
export function validateVerificationToken(token: string): string | null {
  if (!OTP_SECRET) return null;
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;

  const expectedSig = crypto.createHmac('sha256', OTP_SECRET).update(b64).digest('base64url');
  // Constant-time comparison to prevent timing attacks
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const { phone, ts } = JSON.parse(Buffer.from(b64, 'base64url').toString());
    // Token valid for 15 minutes
    if (Date.now() - ts > 15 * 60 * 1000) return null;
    return phone;
  } catch {
    return null;
  }
}
