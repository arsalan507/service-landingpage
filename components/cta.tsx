'use client';

import Link from 'next/link';
import Image from 'next/image';

export function CTA() {
  return (
    <section id="cta" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/60">
      <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 p-2.5 flex items-center justify-center">
            <Image
              src="/2XGLOGO.jpeg"
              alt="2XG Logo"
              width={80}
              height={80}
              className="w-full h-full rounded-xl object-contain"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          Your Competitors Are Already Going Digital.
          <br />
          <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
            Don&apos;t Get Left Behind.
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-sm sm:text-lg text-gray-800 max-w-lg mx-auto">
          500+ Indian workshops already trust 2XG. Start free today — your first month of Pro is on us.
        </p>

        <p className="text-amber-600 font-medium text-sm italic">
          &quot;Ek baar try karo, phir dekhna customers kaise khush hote hain.&quot;
        </p>

        {/* Urgency Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-semibold">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Launch Offer: First month Pro at ₹249 — limited spots left
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/signup?plan=free"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] transition-all"
          >
            Claim Your Free Trial →
          </Link>

          <Link
            href="https://wa.me/919844223174?text=Hi%2C%20I%27m%20interested%20in%202XG%20Service"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-gray-800 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all border border-gray-300 shadow-sm"
          >
            WhatsApp Us
          </Link>
        </div>

        {/* Trust Line */}
        <p className="text-[10px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold text-gray-700 pt-4 border-t border-gray-300">
          NO CREDIT CARD • FREE FOREVER PLAN • 2 MIN SETUP • 500+ WORKSHOPS TRUST US
        </p>
      </div>
    </section>
  );
}
