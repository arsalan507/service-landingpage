'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function CTA() {
  return (
    <section id="cta" className="py-32 sm:py-36 px-4 sm:px-6 lg:px-8 bg-gray-50/60">
      <div className="max-w-3xl mx-auto text-center space-y-8 sm:space-y-12">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          className="flex justify-center"
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            {/* Glow */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-primary-500/50 to-accent-500/50 rounded-2xl blur-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Logo */}
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 p-3 flex items-center justify-center">
              <Image
                src="/2XGLOGO.jpeg"
                alt="2XG Logo"
                width={96}
                height={96}
                className="w-full h-full rounded-xl object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900"
        >
          Your Competitors Are Already Going Digital.
          <br />
          <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
            Don't Get Left Behind.
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-gray-800 max-w-lg mx-auto"
        >
          500+ Indian workshops already trust 2XG. Start free today — your first month of Pro is on us.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="text-amber-600 font-medium text-sm italic"
        >
          &quot;Ek baar try karo, phir dekhna customers kaise khush hote hain.&quot;
        </motion.p>

        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.25 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-semibold"
        >
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Launch Offer: First month Pro at ₹249 — limited spots left
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link
            href="https://service.2xg.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-xl hover:shadow-primary-500/50 transition-shadow"
          >
            Claim Your Free Trial →
          </Link>

          <Link
            href="mailto:hello@2xg.in"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base sm:text-lg font-semibold text-gray-800 bg-white hover:bg-gray-50 transition-colors border border-gray-300 shadow-sm"
          >
            WhatsApp Us
          </Link>
        </motion.div>

        {/* Trust Line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.4 }}
          className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-gray-700 pt-6 border-t border-gray-300"
        >
          NO CREDIT CARD • FREE FOREVER PLAN • 2 MIN SETUP • WORKS IN HINDI & ENGLISH
        </motion.p>
      </div>
    </section>
  );
}
