'use client';

import { motion } from 'framer-motion';
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
    ctaLink: 'https://service.2xg.in',
    featured: false,
    badge: null,
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
    ctaLink: 'https://service.2xg.in',
    featured: true,
    badge: 'FIRST MONTH ₹249',
    features: [
      'Unlimited jobs/month',
      'Up to 10 mechanics',
      'WhatsApp auto-alerts',
      'Google Sheets sync',
      '90-day job history + analytics',
      '5 GB photo storage',
      'Auto Google review collection',
      'PDF/CSV export reports',
      'Remove "Powered by 2XG" branding',
      'Priority WhatsApp support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Multi-location chains',
    price: { monthly: 0, yearly: 0 },
    priceLabel: 'Custom',
    cta: 'Talk to Us on WhatsApp',
    ctaLink: 'mailto:hello@2xg.in',
    featured: false,
    badge: null,
    features: [
      'Everything in Pro',
      'Unlimited mechanics',
      'Unlimited job history',
      '50 GB photo storage',
      'Multiple shop locations',
      'Custom logo on receipts',
      'API access',
      'Dedicated account manager',
      'On-site onboarding support',
    ],
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Affordable Plans for Every Workshop
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4 max-w-xl mx-auto">
            Cheaper than a chai-per-day habit. Start free, upgrade when you grow. No hidden charges — ever.
          </p>
          <p className="text-amber-600 font-medium text-sm italic mb-8">
            &quot;Ek chai ki keemat mein poora workshop management — sochna kya, shuru karo!&quot;
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-gray-200 border border-gray-300">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 sm:px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                !isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 sm:px-6 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
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
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col ${
                plan.featured
                  ? 'bg-gradient-to-b from-blue-50 to-white border-primary-200 shadow-lg shadow-primary-100 hover:shadow-xl hover:shadow-primary-200'
                  : 'bg-white border-gray-300 shadow-md shadow-gray-100 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100'
              }`}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="mb-4 flex gap-2 flex-wrap">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                  >
                    Most Popular
                  </motion.div>
                  {plan.badge && (
                    <div className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                      {plan.badge}
                    </div>
                  )}
                </div>
              )}

              {/* Plan Name */}
              <h3 className="font-display font-bold text-gray-900 text-xl sm:text-2xl mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-700 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.priceLabel ? (
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">{plan.priceLabel}</p>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                        ₹{isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      {plan.featured && !isYearly && (
                        <span className="text-sm text-emerald-600 font-semibold line-through decoration-slate-500">
                        </span>
                      )}
                    </div>
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
                target={plan.ctaLink.startsWith('mailto:') ? undefined : '_blank'}
                rel={plan.ctaLink.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className={`w-full py-3 rounded-full font-semibold text-sm transition-all mb-6 ${
                  plan.featured
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/50'
                    : 'bg-gray-50 border border-gray-300 text-gray-800 hover:bg-gray-100'
                }`}
              >
                {plan.cta} →
              </Link>

              {/* Features List */}
              <div className="space-y-3 flex-1">
                {plan.features.map((feature, featureIdx) => (
                  <div key={featureIdx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
