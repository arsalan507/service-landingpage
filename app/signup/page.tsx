'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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
    shopName: '', ownerName: '', email: '', password: '', phone: '', address: '',
  });
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ slug: string; plan: string } | null>(null);

  // Auto-generate slug from shop name
  useEffect(() => {
    const s = form.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setSlug(s);
  }, [form.shopName]);

  const shortCode = form.shopName.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.shopName.trim() || !form.ownerName.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!slug) {
      setError('Shop name generates an invalid URL. Try a different name.');
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
      const { data, error: rpcError } = await supabase.rpc('public_register_org', {
        p_org_name: form.shopName.trim(),
        p_org_slug: slug,
        p_org_short_code: shortCode || 'SHOP',
        p_owner_name: form.ownerName.trim(),
        p_owner_email: form.email.trim().toLowerCase(),
        p_owner_password: form.password,
        p_owner_phone: form.phone.trim() || null,
        p_org_phone: form.phone.trim() || null,
        p_org_address: form.address.trim() || null,
        p_plan_type: plan,
        p_razorpay_payment_id: paymentId,
      });

      if (rpcError) throw rpcError;

      if (data && data.success) {
        setSuccess({ slug: data.org_slug, plan });
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          window.location.href = `https://service.2xg.in/${data.org_slug}/admin/dashboard`;
        }, 3000);
      } else {
        throw new Error(data?.error || 'Registration failed');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
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
            {/* Shop Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Shop Name *</label>
              <input
                type="text"
                value={form.shopName}
                onChange={(e) => setForm(p => ({ ...p, shopName: e.target.value }))}
                placeholder="e.g. Bharath Cycle Hub"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              {slug && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Your URL: service.2xg.in/<span className="font-mono text-blue-600">{slug}</span>
                </p>
              )}
            </div>

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

            {/* Email + Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@email.com"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Phone + Address (optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="9844223174"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="Bangalore"
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
              disabled={loading}
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
