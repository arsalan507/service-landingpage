'use client';

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
      'No catch! Our Starter plan is free forever with 20 jobs/month, 2 mechanics, live tracking, and digital receipts. We make money when your shop grows and you upgrade to Pro at just ₹499/month. Plus, new workshops get first month at ₹249 — 50% off.',
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
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
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
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-5 sm:mb-8">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Common Questions
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-300 shadow-lg shadow-gray-100 space-y-2">
          {visibleFaqs.map((faq, idx) => (
            <div key={idx}>
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full flex items-center justify-between gap-3 px-3 sm:px-5 py-3.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors group"
              >
                <span className="text-left font-semibold text-gray-900 text-sm sm:text-base">
                  {faq.question}
                </span>

                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  {openIndices.has(idx) ? (
                    <Minus className="w-4 h-4 text-primary-600" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-700 group-hover:text-gray-800" />
                  )}
                </div>
              </button>

              {openIndices.has(idx) && (
                <div className="px-3 sm:px-5 pb-3 text-gray-800 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full mt-3 py-3 rounded-xl text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-200 hover:bg-primary-100 active:bg-primary-200 transition-colors"
            >
              Show {faqs.length - 2} More Questions ↓
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
