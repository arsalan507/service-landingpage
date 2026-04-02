'use client';

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
      className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="font-display text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            How It Works
          </h2>
        </div>

        {/* Desktop Horizontal Stepper */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500" />
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 border border-gray-300 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-primary-600" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white">
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-gray-900 text-lg">{step.title}</h3>
                      <p className="text-gray-700 text-sm mt-2">{step.description}</p>
                      <p className="text-amber-600 font-medium text-xs italic mt-1">{step.hinglish}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet — simple stacked cards */}
        <div className="lg:hidden space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex items-start gap-3 bg-white rounded-xl p-3.5 border border-gray-300 shadow-sm">
                {/* Number + Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 border border-gray-200 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-[1.5px] border-white">
                    {step.number}
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-gray-900 text-sm">{step.title}</h3>
                  <p className="text-gray-700 text-xs mt-0.5">{step.description}</p>
                  <p className="text-amber-600 font-medium text-[11px] italic mt-0.5">{step.hinglish}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
