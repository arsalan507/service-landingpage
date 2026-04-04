'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Check, Loader2, ArrowLeft, Crown } from 'lucide-react';

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_SYYpnpaMsN5Uwn';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, handler: () => void) => void };
  }
}

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get('plan') || 'free';
  const plan = planParam === 'pro' ? 'pro' : 'free';

  const [form, setForm] = useState({
    shopName: '', shortCode: '', ownerName: '', email: '', password: '', phone: '', address: '',
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

  // Password strength checker
  const checkPasswordStrength = (pw: string): number => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  // Auto-generate slug from shop name
  useEffect(() => {
    const s = form.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setSlug(s);
    if (!form.shortCode) {
      const suggested = form.shopName.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase();
      if (suggested.length >= 2) setForm(p => ({ ...p, shortCode: suggested }));
    }
  }, [form.shopName]);

  // Real-time slug availability check (debounced)
  useEffect(() => {
    if (!slug || slug.length < 3) { setSlugTaken(false); return; }
    setSlugChecking(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-availability?type=slug&value=${encodeURIComponent(slug)}`);
        const data = await res.json();
        setSlugTaken(data.taken);
      } catch { setSlugTaken(false); }
      setSlugChecking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  // Real-time email availability check — only when email looks valid
  useEffect(() => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) { setEmailTaken(false); setEmailChecking(false); return; }
    setEmailChecking(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-availability?type=email&value=${encodeURIComponent(form.email.trim().toLowerCase())}`);
        const data = await res.json();
        setEmailTaken(data.taken);
      } catch { setEmailTaken(false); }
      setEmailChecking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [form.email]);

  /** Map raw DB/auth errors to user-friendly messages */
  const friendlyError = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes('unique constraint') && lower.includes('short_code')) return 'This shop code is already taken. Try a different one.';
    if (lower.includes('unique constraint') && lower.includes('slug')) return 'This shop URL is already taken. Try a different shop name.';
    if (lower.includes('unique constraint')) return 'A shop with this name already exists. Try a different name.';
    if (lower.includes('already registered') || lower.includes('already been registered')) return 'This email is already registered. Try logging in instead.';
    if (lower.includes('too many') || lower.includes('rate limit') || lower.includes('email rate limit')) return 'Too many attempts. Please wait 2-3 minutes before trying again.';
    if (lower.includes('invalid email')) return 'Please enter a valid email address.';
    if (lower.includes('password') && lower.includes('weak')) return 'Password is too weak. Use at least 8 characters with uppercase, lowercase, and numbers.';
    if (lower.includes('network') || lower.includes('fetch')) return 'Network error. Check your internet connection and try again.';
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.shopName.trim() || !form.ownerName.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) {
      setError('Enter a valid Indian mobile number (starts with 6-9, 10 digits)');
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
    if (!slug) {
      setError('Shop name generates an invalid URL. Try a different name.');
      return;
    }
    if (slugTaken) {
      setError('This shop URL is already taken. Try a different shop name.');
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

    const options = {
      key: RAZORPAY_KEY,
      amount: 24900, // ₹249 in paise
      currency: 'INR',
      name: '2XG Service',
      description: 'Pro Plan — First Month (50% off)',
      handler: async (response: { razorpay_payment_id: string }) => {
        await registerOrg(response.razorpay_payment_id);
      },
      prefill: {
        name: form.ownerName,
        email: form.email,
        contact: form.phone || undefined,
      },
      theme: { color: '#2563EB' },
      modal: {
        ondismiss: () => {
          setError('Payment cancelled. You can try again.');
          setLoading(false);
        },
      },
    };

    setLoading(true);
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const registerOrg = async (paymentId: string | null) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgName: form.shopName.trim(),
          orgSlug: slug,
          orgShortCode: form.shortCode.toUpperCase() || 'SHOP',
          orgPhone: form.phone.trim() || null,
          orgAddress: form.address.trim() || null,
          ownerName: form.ownerName.trim(),
          ownerEmail: form.email.trim().toLowerCase(),
          ownerPassword: form.password,
          ownerPhone: form.phone.trim() || null,
          planType: plan,
          razorpayPaymentId: paymentId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess({ slug: data.org_slug, plan });
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        window.location.href = `https://service.2xg.in/${data.org_slug}/admin/dashboard`;
      }, 3000);
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(friendlyError(raw));
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your shop is ready! 🎉</h1>
          <p className="text-gray-600 mb-1">
            <strong>{form.shopName}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {success.plan === 'pro' ? '⚡ Pro Plan activated' : '🆓 Free Plan'}
          </p>
          <p className="text-xs text-gray-400 mb-6">Redirecting to your dashboard...</p>
          <a
            href={`https://service.2xg.in/${success.slug}/admin/dashboard`}
            className="inline-block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="w-full max-w-md">
        {/* Back link */}
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
                  ₹249/first month
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Shop Name + Short Code */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Shop Name *</label>
                <input
                  type="text"
                  value={form.shopName}
                  onChange={(e) => setForm(p => ({ ...p, shopName: e.target.value }))}
                  placeholder="e.g. Bharath Cycle Hub"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Short Code *</label>
                <input
                  type="text"
                  value={form.shortCode}
                  onChange={(e) => setForm(p => ({ ...p, shortCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }))}
                  placeholder="BCH"
                  required
                  maxLength={5}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm font-mono text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>
            {slug && (
              <div className="text-[10px] -mt-2 flex items-center gap-2">
                <p className="text-gray-400">
                  Your URL: service.2xg.in/<span className="font-mono text-blue-600">{slug}</span> &middot; Code: <span className="font-mono text-blue-600">{form.shortCode || '—'}</span>
                </p>
                {slugChecking && <span className="text-gray-400">checking...</span>}
                {!slugChecking && slug.length >= 3 && (
                  slugTaken
                    ? <span className="text-red-500 font-semibold">URL taken!</span>
                    : <span className="text-green-600 font-semibold">✓ available</span>
                )}
              </div>
            )}

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(e) => setForm(p => ({ ...p, ownerName: e.target.value }))}
                placeholder="e.g. Bharath Kumar"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm(p => ({ ...p, email: e.target.value })); setEmailTaken(false); }}
                placeholder="you@email.com"
                required
                className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  emailTaken ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {emailChecking && <p className="text-[10px] text-gray-400 mt-1">Checking availability...</p>}
              {emailTaken && <p className="text-[10px] text-red-500 font-semibold mt-1">This email is already registered. <a href="https://service.2xg.in" className="text-blue-600 underline">Login instead →</a></p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => { setForm(p => ({ ...p, password: e.target.value })); setPasswordStrength(checkPasswordStrength(e.target.value)); }}
                placeholder="Min 8 chars, uppercase, number, special"
                required
                minLength={8}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
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

            {/* Phone + City (required) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="10-digit mobile"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
                {form.phone.length === 10 && !/^[6-9]/.test(form.phone) && (
                  <p className="text-[10px] text-red-500 mt-1">Indian mobile numbers start with 6-9</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="Bangalore"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
                {error}
                {error.includes('already registered') && (
                  <a href="https://service.2xg.in" className="ml-1 text-blue-600 font-semibold underline">Login instead →</a>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || slugTaken || emailTaken}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer ${
                plan === 'pro'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {plan === 'pro'
                ? loading ? 'Processing...' : 'Pay ₹249 & Create Account'
                : loading ? 'Creating...' : 'Create Free Account'
              }
            </button>

            {/* Terms */}
            <p className="text-[10px] text-gray-400 text-center">
              By signing up, you agree to our terms of service and privacy policy.
            </p>

            {/* Switch plan */}
            <div className="text-center pt-2 border-t border-gray-100">
              {plan === 'pro' ? (
                <Link href="/signup?plan=free" className="text-xs text-gray-500 hover:text-blue-600">
                  Want to start free instead? →
                </Link>
              ) : (
                <Link href="/signup?plan=pro" className="text-xs text-gray-500 hover:text-blue-600">
                  Want unlimited jobs? Start Pro at ₹249 →
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
