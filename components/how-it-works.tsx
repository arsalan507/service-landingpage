'use client';

import { motion } from 'framer-motion';
import { QrCode, Zap, Activity, CreditCard } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Walk In & Scan',
    description: 'QR code fills details in seconds',
    hinglish: 'Customer aaya, scan kiya, done!',
    icon: QrCode,
  },
  {
    number: 2,
    title: 'Job Created & Assigned',
    description: 'Staff creates job with photos, auto-assigned by workload',
    hinglish: 'Photo lo, job banao, mechanic ko assign karo.',
    icon: Zap,
  },
  {
    number: 3,
    title: 'Live Tracking',
    description: 'Real-time updates, photo proof, ETA',
    hinglish: 'Customer ko har update milta rahega — automatically.',
    icon: Activity,
  },
  {
    number: 4,
    title: 'Pay & Pickup',
    description: 'Digital receipt, pay online/cash, rate service',
    hinglish: 'Payment karo, rating do, chalte bano!',
    icon: CreditCard,
  },
];

export function HowItWorks() {

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            How It Works
          </h2>
        </motion.div>

        {/* Desktop Horizontal Stepper */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Progress Line Background */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-200" />

            {/* Progress Line - Static full width */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500" />

            {/* Steps Grid */}
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: idx * 0.12 }}
                    className="flex flex-col items-center text-center space-y-4"
                  >
                    {/* Icon */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 border border-gray-300 flex items-center justify-center group hover:border-gray-300 transition-colors">
                        <Icon className="w-10 h-10 text-primary-600" />
                      </div>

                      {/* Step Number Badge */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white">
                        {step.number}
                      </div>
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="font-display font-bold text-gray-900 text-lg">
                        {step.title}
                      </h3>
                      <p className="text-gray-700 text-sm mt-2">
                        {step.description}
                      </p>
                      <p className="text-amber-600 font-medium text-xs italic mt-1">
                        {step.hinglish}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          <div className="relative pl-20">
            {/* Vertical Line Background */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Vertical Line - Static full height */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />

            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: idx * 0.12 }}
                  className="mb-12 relative"
                >
                  {/* Icon Circle */}
                  <div className="absolute left-0 top-0 -translate-x-6 sm:-translate-x-8 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 border border-gray-300 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600" />
                  </div>

                  {/* Step Number Badge */}
                  <div className="absolute -left-4 sm:-left-6 -top-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white z-10">
                    {step.number}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-lg">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 text-sm mt-2">
                      {step.description}
                    </p>
                    <p className="text-amber-600 font-medium text-xs italic mt-1">
                      {step.hinglish}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
