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
    <section className="min-h-screen pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5 sm:space-y-8"
          >
            {/* Offer Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs sm:text-sm font-semibold"
            >
              <motion.div
                className="relative w-2 h-2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-emerald-500 rounded-full" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping" />
              </motion.div>
              First Month Pro at just ₹249 (50% off)
            </motion.div>

            {/* Heading with rotating word */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Tired of Customers{' '}
                <span className="relative inline-block min-w-[160px] sm:min-w-[280px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                      transition={{ duration: 0.4 }}
                      className={`relative z-10 bg-gradient-to-r ${rotatingWords[wordIndex].color} bg-clip-text text-transparent`}
                    >
                      {rotatingWords[wordIndex].text}
                    </motion.span>
                  </AnimatePresence>
                  <motion.div
                    className="absolute bottom-0 sm:bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-red-500/10 rounded-lg"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>{' '}
                Your Workshop?
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-xl text-gray-800 font-medium"
              >
                Show them every step. Build trust. Get 5-star reviews automatically.
              </motion.p>
            </div>

            {/* Rotating Hinglish line */}
            <div className="relative h-10 sm:h-12 overflow-hidden rounded-lg bg-amber-50 border border-amber-200 px-3 sm:px-4 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={lineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm sm:text-base text-amber-700 font-semibold italic"
                >
                  {hinglishLines[lineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Pain Point + Solution */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-lg text-gray-800 max-w-lg leading-relaxed"
            >
              70% of Indian bike owners suspect overcharging at service centers. 2XG gives your customers <strong className="text-gray-900">live tracking, photo proof, and WhatsApp updates</strong> — so they never doubt your work again.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="https://service.2xg.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:shadow-primary-500/50 transition-all"
                >
                  Start Free — No Card Needed →
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#pricing"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold text-gray-800 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  See Pricing (from ₹0/month)
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 1 } },
              }}
              className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-6 text-xs sm:text-sm text-gray-800 pt-4 sm:pt-6 border-t border-gray-300"
            >
              {[
                '500+ workshops',
                'Works on any phone',
                '2 min setup',
                'Hindi & English',
              ].map((badge, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  {badge}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Dashboard Mockup — hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 1, type: 'spring' }}
            className="hidden lg:flex justify-center perspective-[1000px]"
          >
            <motion.div
              className="max-w-sm w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-gray-200/80 border border-gray-300"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.02, rotateY: -3 }}
            >
              {/* Shop Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-gray-900 text-lg">
                    Bharath Cycle Hub
                  </h3>
                  <p className="text-xs text-gray-600">Workshop</p>
                </div>
                <motion.div
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200"
                  animate={{ boxShadow: ['0 0 0px rgba(52,211,153,0)', '0 0 12px rgba(52,211,153,0.3)', '0 0 0px rgba(52,211,153,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative w-2 h-2">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">LIVE</span>
                </motion.div>
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
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                  />
                </div>

                {/* Checklist */}
                <motion.div
                  className="space-y-2 pt-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.3, delayChildren: 1.5 } },
                  }}
                >
                  {[
                    'Photos received',
                    'In-progress update sent',
                    'Waiting for feedback',
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      className="flex items-center gap-2 text-xs text-gray-700"
                    >
                      <motion.div
                        className="w-3 h-3 rounded-full bg-primary-100 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 + idx * 0.3, type: 'spring' }}
                      >
                        <span className="text-primary-600 text-[10px]">✓</span>
                      </motion.div>
                      {item}
                    </motion.div>
                  ))}
                </motion.div>

                {/* WhatsApp notification */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 3, type: 'spring', stiffness: 200 }}
                  className="mt-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2"
                >
                  <span className="text-emerald-600 text-sm">📱</span>
                  <div>
                    <p className="text-[10px] text-emerald-700 font-semibold">WhatsApp sent</p>
                    <p className="text-[10px] text-gray-600">&quot;Aapki bike ka oil change ho gaya hai&quot;</p>
                  </div>
                </motion.div>

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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
