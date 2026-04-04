'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const rotatingWords = [
  { text: 'Not Trusting', color: 'from-red-600 via-orange-600 to-amber-600' },
  { text: 'Doubting', color: 'from-orange-600 via-amber-600 to-yellow-600' },
  { text: 'Questioning', color: 'from-pink-600 via-rose-600 to-red-600' },
  { text: 'Leaving', color: 'from-purple-600 via-violet-600 to-indigo-600' },
];

const hinglishLines = [
  '"Mera bike ka kya hua?" — Ab ye sawaal nahi aayega.',
  '"Bill zyada lag raha hai" — Ab photo proof dikhao, argument khatam.',
  '"Kab tak ready hoga?" — WhatsApp pe live update, tension khatam.',
  '"Pichli baar galat part lagaya tha" — Ab har step camera pe.',
];

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % hinglishLines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="lg:min-h-[calc(100svh-4rem)] pt-18 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Offer Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs sm:text-sm font-semibold"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              First Month Pro at just ₹249 (50% off)
            </motion.div>

            {/* Heading with rotating word */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="font-display text-[1.75rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Tired of Customers{' '}
                <span className="relative inline-block min-w-[140px] sm:min-w-[240px] lg:min-w-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className={`relative z-10 bg-gradient-to-r ${rotatingWords[wordIndex].color} bg-clip-text text-transparent`}
                    >
                      {rotatingWords[wordIndex].text}
                    </motion.span>
                  </AnimatePresence>
                </span>{' '}
                Your Workshop?
              </h1>

              <p className="text-sm sm:text-lg lg:text-xl text-gray-800 font-medium max-w-lg">
                Show them every step. Build trust. Get 5-star reviews automatically.
              </p>
            </div>

            {/* Rotating Hinglish line */}
            <div className="relative h-10 sm:h-12 overflow-hidden rounded-lg bg-amber-50 border border-amber-200 px-3 sm:px-4 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={lineIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm lg:text-base text-amber-700 font-semibold italic"
                >
                  {hinglishLines[lineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Pain Point + Solution */}
            <p className="text-xs sm:text-base lg:text-lg text-gray-800 max-w-lg leading-relaxed">
              70% of Indian bike owners suspect overcharging at service centers. 2XG gives your customers <strong className="text-gray-900">live tracking, photo proof, and WhatsApp updates</strong> — so they never doubt your work again.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup?plan=free"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] transition-all"
              >
                Start Free — No Card Needed →
              </Link>
              <Link
                href="#pricing"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold text-gray-800 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                See Pricing (from ₹0/month)
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-5 text-xs sm:text-sm text-gray-800 pt-4 border-t border-gray-300">
              {[
                '500+ workshops',
                'Works on any phone',
                '2 min setup',
                'Hindi & English',
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Dashboard Mockup — hidden on mobile/tablet */}
          <div className="hidden lg:flex justify-center">
            <div className="max-w-sm w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-gray-200/80 border border-gray-300">
              {/* Shop Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-gray-900 text-lg">
                    Bharath Cycle Hub
                  </h3>
                  <p className="text-xs text-gray-600">Workshop</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-600 font-semibold">LIVE</span>
                </div>
              </div>

              {/* Job Card */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-display font-semibold text-gray-900 text-base">
                    Hero Splendor
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">KA-01-AB-1234</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 border border-accent-200">
                    <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                    <span className="text-xs text-accent-600 font-semibold">IN PROGRESS</span>
                  </div>
                  <span className="text-xs text-gray-600">65%</span>
                </div>

                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full w-[65%]" />
                </div>

                {/* Checklist */}
                <div className="space-y-2 pt-2">
                  {[
                    'Photos received',
                    'In-progress update sent',
                    'Waiting for feedback',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <div className="w-3 h-3 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 text-[10px]">✓</span>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                {/* WhatsApp notification */}
                <div className="mt-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                  <span className="text-emerald-600 text-sm">📱</span>
                  <div>
                    <p className="text-[10px] text-emerald-700 font-semibold">WhatsApp sent</p>
                    <p className="text-[10px] text-gray-600">&quot;Aapki bike ka oil change ho gaya hai&quot;</p>
                  </div>
                </div>

                {/* Mechanic Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                    R
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      Raju, Senior Mechanic
                    </p>
                    <p className="text-xs text-gray-600">~45 min Estimated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
