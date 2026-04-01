'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How does 2XG Service work for my shop?',
    answer:
      'Customers scan a QR code at your counter, which automatically fills in bike details. Your team creates the job in the dashboard, assigns it by workload, and customers receive real-time updates with photos on WhatsApp. Finally, they pay and rate the service — all in one platform. No register books needed anymore.',
  },
  {
    question: 'Do my customers need to download an app?',
    answer:
      'No! 2XG Service is a web app. Customers simply scan the QR code and access everything through their browser. No downloads, no installations. It works on any phone — even budget Android phones with low storage. Updates go directly to WhatsApp.',
  },
  {
    question: 'Is the free plan really free? What\'s the catch?',
    answer:
      'No catch! Our Starter plan is free forever with up to 5 jobs per day, basic tracking, and digital receipts. We make money when your shop grows and you upgrade to Pro at just ₹499/month. Plus, new workshops get first month at ₹249 — 50% off.',
  },
  {
    question: 'How does this help me get more customers?',
    answer:
      'Three ways: (1) Auto-collect Google reviews after every service — workshops using 2XG average 4.7 stars. (2) When customers share their live tracking link with friends, it\'s free marketing for your shop. (3) Digital transparency means more word-of-mouth referrals. Indian customers trust shops that show their work.',
  },
  {
    question: 'Will this work if my mechanics are not tech-savvy?',
    answer:
      'Absolutely! We built 2XG for Indian workshops. The interface is simple — tap to update status, tap to take a photo. Most mechanics learn it in 5 minutes. We also offer Hindi language support and WhatsApp-based training.',
  },
  {
    question: 'How does photo proof stop customer complaints about overcharging?',
    answer:
      'Mechanics take before/after photos of every part changed and every job done. These are shared automatically with customers via WhatsApp. When customers can SEE the worn-out brake pad being replaced, they don\'t argue about the bill. Shops using photo proof report 90% fewer billing disputes.',
  },
  {
    question: 'Can I manage multiple shop locations?',
    answer:
      'Yes! Our Enterprise plan lets you manage all locations from a single dashboard. See live jobs across all shops, assign mechanics, and get consolidated revenue reports. Perfect for growing chains across Indian cities.',
  },
  {
    question: 'What if I need help setting up?',
    answer:
      'Setup takes just 2 minutes! We\'ve designed 2XG to be super simple. If you need help, our support team is available via WhatsApp in Hindi and English. For Enterprise customers, we send a team member to your shop for onboarding.',
  },
];

export function FAQ() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0, 1]));
  const [showAll, setShowAll] = useState(false);

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 2);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Common Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-300 shadow-lg shadow-gray-100 space-y-3"
        >
          {visibleFaqs.map((faq, idx) => (
            <motion.div key={idx} layout>
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">
                  {faq.question}
                </span>

                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  {openIndices.has(idx) ? (
                    <Minus className="w-4 h-4 text-primary-600" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-700 group-hover:text-gray-800" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndices.has(idx) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-4 text-gray-800 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {!showAll && (
            <motion.button
              onClick={() => setShowAll(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-3 rounded-xl text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-colors"
            >
              Show {faqs.length - 2} More Questions ↓
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
