'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Check, Loader2, ArrowLeft, Crown, Eye, EyeOff, Phone, ShieldCheck } from 'lucide-react';

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SYYpnpaMsN5Uwn';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, handler: () => void) => void };
  }
}

// =============================================
// Step 1: Phone + OTP Verification
// =============================================
function OTPStep({ onVerified, plan }: { onVerified: (phone: string, token: string) => void; plan: string }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendOTP = async () => {
    setError(null);
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Enter a valid Indian mobile number (starts with 6-9, 10 digits)');
      return;
    }

    setSending(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setOtpSent(true);
      setCooldown(30); // 30 second cooldown before resend
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Check your connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to send OTP');
      }
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a valid 6-digit OTP');
      return;
    }

    setVerifying(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ''), otp }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid OTP');
      }

      onVerified(phone.replace(/\D/g, ''), data.verificationToken);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSending(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ''), action: 'resend' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to resend');
      }
      setCooldown(30);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Phone size={24} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Verify your phone</h2>
        <p className="text-xs text-gray-500 mt-1">We&apos;ll send a 6-digit code to verify your number</p>
      </div>

      {/* Phone input */}
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none">+91</span>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile"
            required
            autoFocus
            inputMode="numeric"
            maxLength={10}
            disabled={otpSent}
            className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${otpSent ? 'bg-gray-50 text-gray-500' : ''}`}
          />
        </div>
        {phone.length === 10 && !/^[6-9]/.test(phone) && (
          <p className="text-[10px] text-red-500 mt-1">Indian mobile numbers start with 6-9</p>
        )}
      </div>

      {/* OTP input (shown after send) */}
      {otpSent && (
        <div>
          <label htmlFor="otp" className="block text-xs font-semibold text-gray-600 mb-1">Enter OTP *</label>
          <input
            ref={otpInputRef}
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit code"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-[10px] text-gray-400">Sent to +91 {phone}</p>
            {cooldown > 0 ? (
              <p className="text-[10px] text-gray-400">Resend in {cooldown}s</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={sending}
                className="text-[10px] text-blue-600 font-semibold hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Action button */}
      {!otpSent ? (
        <button
          type="button"
          onClick={sendOTP}
          disabled={sending || phone.replace(/\D/g, '').length !== 10}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {sending && <Loader2 size={16} className="animate-spin" />}
          {sending ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleVerify}
          disabled={verifying || otp.length !== 6}
          className={`w-full py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60 flex items-center justify-center gap-2 transition-all cursor-pointer ${
            plan === 'pro'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/30'
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {verifying && <Loader2 size={16} className="animate-spin" />}
          {verifying ? 'Verifying...' : 'Verify & Continue'}
        </button>
      )}

      {otpSent && (
        <button
          type="button"
          onClick={() => { setOtpSent(false); setOtp(''); setError(null); }}
          className="w-full text-xs text-gray-500 hover:text-gray-700 text-center"
        >
          Change phone number
        </button>
      )}
    </div>
  );
}

// =============================================
// Step 2: Signup Form (after OTP verified)
// =============================================
function SignupFormStep({ phone, verificationToken, plan }: { phone: string; verificationToken: string; plan: string }) {
  const [form, setForm] = useState({
    shopName: '', ownerName: '', email: '', password: '', address: '',
  });
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ slug: string; plan: string } | null>(null);
  const [slugTaken, setSlugTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const slugAbort = useRef<AbortController | null>(null);
  const emailAbort = useRef<AbortController | null>(null);

  const checkPasswordStrength = useCallback((pw: string): number => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }, []);

  // Auto-generate slug
  useEffect(() => {
    const s = form.shopName
      .toLowerCase()
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(s);
  }, [form.shopName]);

  // Slug availability check (debounced + AbortController)
  useEffect(() => {
    if (!slug || slug.length < 3) { setSlugTaken(false); setSlugChecking(false); return; }
    setSlugChecking(true);
    const timer = setTimeout(async () => {
      slugAbort.current?.abort();
      const controller = new AbortController();
      slugAbort.current = controller;
      try {
        const res = await fetch(`/api/check-availability?type=slug&value=${encodeURIComponent(slug)}`, { signal: controller.signal });
        const data = await res.json();
        if (!controller.signal.aborted) { setSlugTaken(data.taken); setSlugChecking(false); }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        if (!controller.signal.aborted) { setSlugTaken(false); setSlugChecking(false); }
      }
    }, 700);
    return () => { clearTimeout(timer); slugAbort.current?.abort(); };
  }, [slug]);

  // Email availability check
  useEffect(() => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) { setEmailTaken(false); setEmailChecking(false); return; }
    setEmailChecking(true);
    const timer = setTimeout(async () => {
      emailAbort.current?.abort();
      const controller = new AbortController();
      emailAbort.current = controller;
      try {
        const res = await fetch(`/api/check-availability?type=email&value=${encodeURIComponent(form.email.trim().toLowerCase())}`, { signal: controller.signal });
        const data = await res.json();
        if (!controller.signal.aborted) { setEmailTaken(data.taken); setEmailChecking(false); }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        if (!controller.signal.aborted) { setEmailTaken(false); setEmailChecking(false); }
      }
    }, 700);
    return () => { clearTimeout(timer); emailAbort.current?.abort(); };
  }, [form.email]);

  const friendlyError = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes('already registered') || lower.includes('already been registered')) return 'This email is already registered. Try logging in instead.';
    if (lower.includes('invalid email')) return 'Please enter a valid email address.';
    if (lower.includes('password') && lower.includes('weak')) return 'Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers.';
    if (lower.includes('network') || lower.includes('fetch')) return 'Network error. Check your internet connection and try again.';
    if (lower.includes('otp_expired') || lower.includes('verification expired')) return 'Phone verification expired. Please go back and verify again.';
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit
    setError(null);

    if (!form.shopName.trim() || !form.ownerName.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (!form.address.trim()) {
      setError('Enter your city');
      return;
    }
    if (passwordStrength < 3) {
      setError('Password too weak. Use 8+ characters with uppercase, lowercase, number, and special character.');
      return;
    }
    if (!slug || slug.length < 3) {
      setError('Shop name must contain at least 3 letters or numbers.');
      return;
    }
    if (slugTaken) {
      setError('This shop name is already taken. Try a different name.');
      return;
    }
    if (emailTaken) {
      setError('This email is already registered. Please login instead.');
      return;
    }

    if (plan === 'pro') {
      openRazorpay();
    } else {
      await registerOrg(null);
    }
  };

  const openRazorpay = () => {
    if (!window.Razorpay) {
      setError('Payment system is loading. Please try again.');
      return;
    }

    setLoading(true);
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY,
      amount: 24900,
      currency: 'INR',
      name: '2XG Service',
      description: 'Pro Plan - First Month (50% off)',
      handler: async (response: { razorpay_payment_id: string }) => {
        await registerOrg(response.razorpay_payment_id);
      },
      prefill: { name: form.ownerName, email: form.email, contact: phone },
      theme: { color: '#2563EB' },
      modal: {
        ondismiss: () => { setError('Payment cancelled. You can try again.'); setLoading(false); },
      },
    });
    rzp.open();
  };

  const registerOrg = async (paymentId: string | null) => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgName: form.shopName.trim(),
          orgSlug: slug,
          orgPhone: phone,
          orgAddress: form.address.trim() || null,
          ownerName: form.ownerName.trim(),
          ownerEmail: form.email.trim().toLowerCase(),
          ownerPassword: form.password,
          ownerPhone: phone,
          planType: plan,
          razorpayPaymentId: paymentId,
          verificationToken,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      setSuccess({ slug: data.org_slug, plan });
      setTimeout(() => {
        window.location.href = `https://service.2xg.in/${data.org_slug}/admin/dashboard`;
      }, 3000);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        const raw = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(friendlyError(raw));
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your shop is ready!</h1>
        <p className="text-gray-600 mb-1"><strong>{form.shopName}</strong></p>
        <p className="text-sm text-gray-500 mb-4">{success.plan === 'pro' ? 'Pro Plan activated' : 'Free Plan'}</p>
        <p className="text-xs text-gray-400 mb-6">Redirecting to your dashboard...</p>
        <a
          href={`https://service.2xg.in/${success.slug}/admin/dashboard`}
          className="inline-block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  const isChecking = slugChecking || emailChecking;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Verified phone badge */}
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
        <ShieldCheck size={16} className="text-green-600" />
        <span className="text-xs text-green-700 font-medium">+91 {phone} verified</span>
      </div>

      {/* Shop Name */}
      <div>
        <label htmlFor="shopName" className="block text-xs font-semibold text-gray-600 mb-1">Shop Name *</label>
        <input
          id="shopName"
          type="text"
          value={form.shopName}
          onChange={(e) => setForm(p => ({ ...p, shopName: e.target.value }))}
          placeholder="e.g. Bharath Cycle Hub"
          required
          autoFocus
          autoComplete="organization"
          className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
            slugTaken ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {slug && slug.length >= 3 && (
          <div className="text-[10px] mt-1 flex items-center gap-2">
            <p className="text-gray-400">
              Your URL: service.2xg.in/<span className="font-mono text-blue-600">{slug}</span>
            </p>
            {slugChecking && <span className="text-gray-400">checking...</span>}
            {!slugChecking && (
              slugTaken
                ? <span className="text-red-500 font-semibold">taken</span>
                : <span className="text-green-600 font-semibold">available</span>
            )}
          </div>
        )}
      </div>

      {/* Owner Name */}
      <div>
        <label htmlFor="ownerName" className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
        <input
          id="ownerName"
          type="text"
          value={form.ownerName}
          onChange={(e) => setForm(p => ({ ...p, ownerName: e.target.value }))}
          placeholder="e.g. Bharath Kumar"
          required
          autoComplete="name"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => { setForm(p => ({ ...p, email: e.target.value })); setEmailTaken(false); }}
          placeholder="you@email.com"
          required
          autoComplete="email"
          className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
            emailTaken ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {emailChecking && <p className="text-[10px] text-gray-400 mt-1">Checking availability...</p>}
        {emailTaken && <p className="text-[10px] text-red-500 font-semibold mt-1">This email is already registered. <a href="https://service.2xg.in" className="text-blue-600 underline">Login instead</a></p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => { setForm(p => ({ ...p, password: e.target.value })); setPasswordStrength(checkPasswordStrength(e.target.value)); }}
            placeholder="Min 8 chars, uppercase, number, special"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {form.password && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`flex-1 rounded-full transition-all ${
                  passwordStrength >= i
                    ? passwordStrength <= 2 ? 'bg-red-400' : passwordStrength <= 3 ? 'bg-yellow-400' : 'bg-green-500'
                    : 'bg-gray-200'
                }`} />
              ))}
            </div>
            <span className={`text-[10px] font-semibold ${
              passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Fair' : passwordStrength <= 4 ? 'Strong' : 'Very Strong'}
            </span>
          </div>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
        <input
          id="city"
          type="text"
          value={form.address}
          onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
          placeholder="Bangalore"
          required
          autoComplete="address-level2"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || slugTaken || emailTaken || isChecking}
        className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer ${
          plan === 'pro'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {plan === 'pro'
          ? loading ? 'Processing...' : 'Pay Rs.249 & Create Account'
          : loading ? 'Creating...' : 'Create Free Account'
        }
      </button>

      {/* Terms */}
      <p className="text-[10px] text-gray-400 text-center">
        By signing up, you agree to our{' '}
        <a href="/terms" className="underline hover:text-gray-600">terms of service</a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-gray-600">privacy policy</a>.
      </p>
    </form>
  );
}

// =============================================
// Main Signup Page — orchestrates Step 1 + Step 2
// =============================================
function SignupPage() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || 'free';
  const plan = planParam === 'pro' ? 'pro' : 'free';

  const [verified, setVerified] = useState<{ phone: string; token: string } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-10">
      {plan === 'pro' && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          {/* Plan badge */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {plan === 'pro' ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                  <Crown size={12} /> Pro Plan
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                  Rs.249/first month
                </span>
              </div>
            ) : (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">
                Free Plan
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Create your shop</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Set up in 2 minutes. No technical skills needed.</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex-1 h-1 rounded-full ${verified ? 'bg-green-500' : 'bg-blue-500'}`} />
            <div className={`flex-1 h-1 rounded-full ${verified ? 'bg-blue-500' : 'bg-gray-200'}`} />
          </div>

          {!verified ? (
            <OTPStep onVerified={(phone, token) => setVerified({ phone, token })} plan={plan} />
          ) : (
            <SignupFormStep phone={verified.phone} verificationToken={verified.token} plan={plan} />
          )}

          {/* Switch plan */}
          <div className="text-center pt-4 mt-4 border-t border-gray-100">
            {plan === 'pro' ? (
              <Link href="/signup?plan=free" className="text-xs text-gray-500 hover:text-blue-600">
                Want to start free instead?
              </Link>
            ) : (
              <Link href="/signup?plan=pro" className="text-xs text-gray-500 hover:text-blue-600">
                Want unlimited jobs? Start Pro at Rs.249
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    }>
      <SignupPage />
    </Suspense>
  );
}
