'use client';

import {
  Activity,
  Camera,
  MessageCircle,
  BarChart3,
  FileText,
  Users,
  QrCode,
  Star,
} from 'lucide-react';

const primaryFeatures = [
  {
    title: 'Live Tracking',
    description: 'Customers see exactly what\'s happening — no more "come back in 2 hours" guesswork.',
    hinglish: '"Kab tak hoga?" — Ab ye call nahi aayegi.',
    icon: Activity,
    color: 'from-primary-500 to-blue-500',
  },
  {
    title: 'Photo Proof',
    description: 'Before & after photos eliminate "did they actually change the part?" doubts.',
    hinglish: '"Sach mein part badla?" — Ab photo dekho, bharosa karo.',
    icon: Camera,
    color: 'from-accent-500 to-purple-500',
  },
  {
    title: 'WhatsApp Alerts',
    description: 'Auto-send updates on WhatsApp — India\'s #1 app. No more "is my bike ready?" calls.',
    hinglish: 'Customer ko WhatsApp pe automatic update — tension khatam.',
    icon: MessageCircle,
    color: 'from-emerald-500 to-green-500',
  },
];

const secondaryFeatures = [
  { title: 'Smart Dashboard', icon: BarChart3, color: 'text-blue-400', desc: 'Track daily jobs & revenue' },
  { title: 'Digital Bills', icon: FileText, color: 'text-purple-400', desc: 'No more handwritten receipts' },
  { title: 'Team Management', icon: Users, color: 'text-pink-400', desc: 'Assign jobs to mechanics' },
  { title: 'QR Check-In', icon: QrCode, color: 'text-cyan-400', desc: 'Customer walks in, scans, done' },
  { title: 'Google Reviews', icon: Star, color: 'text-yellow-400', desc: 'Auto-collect 5-star ratings' },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative bg-gray-50/60"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-5 sm:mb-10">
          <h2 className="font-display text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Every Feature Your Workshop Needs
          </h2>
          <p className="text-gray-700 text-xs sm:text-lg mt-2 sm:mt-3 max-w-2xl mx-auto">
            Built for Indian service centers — solve the trust gap, reduce complaints, grow with 5-star reviews.
          </p>
        </div>

        {/* Primary Features — compact on mobile, cards on desktop */}
        <div className="grid md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-10">
          {primaryFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-7 border border-gray-300 shadow-md shadow-gray-100 hover:border-primary-400 hover:shadow-lg transition-all"
              >
                {/* Mobile: horizontal layout | Desktop: vertical */}
                <div className="flex items-start gap-3 sm:block">
                  <div
                    className={`w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 sm:mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4 sm:w-7 sm:h-7 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-gray-900 text-sm sm:text-lg sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-0 line-clamp-2 sm:line-clamp-none">
                      {feature.description}
                    </p>
                    <p className="text-amber-600 font-medium text-[11px] sm:text-xs italic mt-1 sm:mt-2">
                      {feature.hinglish}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Features Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {secondaryFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white rounded-lg p-2.5 sm:p-4 border border-gray-300 shadow-sm hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col items-center text-center space-y-1">
                  <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${feature.color}`} />
                  <h4 className="font-semibold text-gray-900 text-[10px] sm:text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-[9px] sm:text-xs hidden sm:block">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
