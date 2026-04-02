'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    description: 'Free forever — no card needed',
    price: { monthly: 0, yearly: 0 },
    priceLabel: 'Free',
    cta: 'Start Free Today',
    ctaLink: '/signup?plan=free',
    featured: false,
    badge: null,
    enterprise: false,
    features: [
      '20 jobs/month',
      '2 mechanic slots',
      'Live tracking & photo updates',
      'Digital receipts',
      '7-day job history',
      '100 MB photo storage',
      'Works on any phone',
    ],
  },
  {
    name: 'Pro',
    description: 'For growing workshops',
    price: { monthly: 499, yearly: 333 },
    priceLabel: null,
    cta: 'Start with ₹249 First Month',
    ctaLink: '/signup?plan=pro',
    featured: true,
    badge: 'FIRST MONTH ₹249',
    enterprise: false,
    features: [
      'Unlimited jobs/month',
      'Up to 5 mechanics',
      'WhatsApp auto-alerts',
      '30-day job history + analytics',
      '2 GB photo storage',
      'CSV export reports',
      'Manual Google review link',
      'Standard support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Multi-location chains',
    price: { monthly: 0, yearly: 0 },
    priceLabel: 'Custom',
    cta: 'Talk to Us on WhatsApp',
    ctaLink: 'https://wa.me/919844223174?text=Hi%2C%20I%27m%20interested%20in%202XG%20Enterprise%20plan',
    featured: false,
    badge: null,
    enterprise: true,
    features: [
      'Everything in Pro',
      'Unlimited mechanics',
      'Unlimited job history',
      '50 GB photo storage',
      'Multiple shop locations',
      'Google Sheets sync',
      'Custom logo on receipts',
      'Remove "Powered by 2XG" branding',
      'Auto Google review collection',
      'PDF export + reports',
      'Tally/accounting export',
      'Dedicated account manager',
      'On-site onboarding support',
    ],
  },
];

function PricingCard({ plan, isYearly }: { plan: typeof plans[0]; isYearly: boolean }) {
  const isWhatsApp = plan.ctaLink.startsWith('https://wa.me');

  return (
    <div
      className={`rounded-2xl p-5 sm:p-7 border transition-shadow flex flex-col min-w-[280px] w-[300px] sm:w-auto flex-shrink-0 sm:flex-shrink ${
        plan.featured
          ? 'bg-gradient-to-b from-blue-50 to-white border-primary-300 shadow-xl shadow-primary-100/60 ring-1 ring-primary-200'
          : plan.enterprise
          ? 'bg-gradient-to-b from-violet-50/40 to-white border-gray-300 shadow-md shadow-gray-100'
          : 'bg-white border-gray-300 shadow-md shadow-gray-100'
      }`}
    >
      {/* Badges */}
      {plan.featured && (
        <div className="mb-3 flex gap-2 flex-wrap">
          <div className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
            Most Popular
          </div>
          {plan.badge && (
            <div className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
              {plan.badge}
            </div>
          )}
        </div>
      )}

      {/* Plan Name */}
      <h3 className={`font-display font-bold text-lg sm:text-2xl mb-1 ${
        plan.enterprise ? 'text-violet-900' : 'text-gray-900'
      }`}>
        {plan.name}
      </h3>
      <p className="text-gray-700 text-sm mb-4 sm:mb-5">{plan.description}</p>

      {/* Price */}
      <div className="mb-4 sm:mb-5">
        {plan.priceLabel ? (
          <p className={`text-3xl sm:text-4xl font-bold ${
            plan.enterprise ? 'text-violet-900' : 'text-gray-900'
          }`}>{plan.priceLabel}</p>
        ) : (
          <>
            <span className="text-3xl sm:text-4xl font-bold text-gray-900">
              ₹{isYearly ? plan.price.yearly : plan.price.monthly}
            </span>
            <p className="text-gray-700 text-xs sm:text-sm mt-1">
              per {isYearly ? 'month (billed yearly)' : 'month'}
            </p>
            {plan.featured && (
              <p className="text-emerald-600 text-xs font-semibold mt-1">
                {isYearly ? '₹3,999/year — save ₹2,000!' : 'First month only ₹249 — 50% off!'}
              </p>
            )}
          </>
        )}
      </div>

      {/* CTA Button */}
      <Link
        href={plan.ctaLink}
        {...(isWhatsApp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`w-full py-3 rounded-full font-semibold text-sm text-center block active:scale-[0.98] transition-all mb-4 sm:mb-5 ${
          plan.featured
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30'
            : plan.enterprise
            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30'
            : 'bg-gray-50 border border-gray-300 text-gray-800 hover:bg-gray-100'
        }`}
      >
        {plan.cta} →
      </Link>

      {/* Features List */}
      <div className="space-y-2 sm:space-y-2.5 flex-1">
        {plan.features.map((feature, featureIdx) => (
          <div key={featureIdx} className="flex items-start gap-2">
            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              plan.enterprise ? 'text-violet-600' : 'text-emerald-600'
            }`} />
            <span className="text-gray-800 text-xs sm:text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3">
            Affordable Plans for Every Workshop
          </h2>
          <p className="text-gray-700 text-sm sm:text-lg mb-3 max-w-xl mx-auto">
            Cheaper than a chai-per-day habit. Start free, upgrade when you grow. No hidden charges — ever.
          </p>
          <p className="text-amber-600 font-medium text-sm italic mb-6">
            &quot;Ek chai ki keemat mein poora workshop management — sochna kya, shuru karo!&quot;
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-gray-200 border border-gray-300">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 sm:px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                !isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 sm:px-6 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Yearly
              <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                isYearly
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-emerald-50 text-emerald-600'
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{ scrollSnapAlign: 'start' }}>
                <PricingCard plan={plan} isYearly={isYearly} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />
          ))}
        </div>
      </div>
    </section>
  );
}
