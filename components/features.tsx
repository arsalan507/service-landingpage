'use client';

import { motion } from 'framer-motion';
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
    description: 'Customers see exactly what\'s happening — no more "come back in 2 hours" guesswork. Build trust with every update.',
    hinglish: '"Kab tak hoga?" — Ab ye call nahi aayegi.',
    icon: Activity,
    color: 'from-primary-500 to-blue-500',
  },
  {
    title: 'Photo Proof',
    description: 'Before & after photos eliminate "did they actually change the part?" doubts. End overcharging complaints forever.',
    hinglish: '"Sach mein part badla?" — Ab photo dekho, bharosa karo.',
    icon: Camera,
    color: 'from-accent-500 to-purple-500',
  },
  {
    title: 'WhatsApp Alerts',
    description: 'Auto-send updates on WhatsApp — India\'s #1 app. No customer needs to call and ask "is my bike ready?"',
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
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-gray-50/60"
    >
      <div className="absolute inset-0 dot-grid opacity-[0.015]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Every Feature Your Workshop Needs
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Built for Indian service centers — solve the trust gap, reduce customer complaints, and grow your business with 5-star reviews.
          </p>
        </motion.div>

        {/* Primary Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {primaryFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-300 shadow-md shadow-gray-100 hover:border-primary-400 hover:shadow-lg hover:shadow-primary-100 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <h3 className="font-display font-bold text-gray-900 text-base sm:text-lg mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-700 text-sm">
                  {feature.description}
                </p>

                <p className="text-amber-600 font-medium text-xs italic mt-2">
                  {feature.hinglish}
                </p>

                {/* Visual representation */}
                <div className="mt-4 space-y-2">
                  {feature.title === 'Live Tracking' && (
                    <div className="flex gap-2">
                      {['Received', 'Assigned', 'In Progress', 'Done', 'Delivered'].map((step, i) => (
                        <div
                          key={step}
                          className={`w-2 h-2 rounded-full ${
                            i <= 2 ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {feature.title === 'Photo Updates' && (
                    <div className="flex gap-2 h-12">
                      <div className="flex-1 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="w-6 h-12 bg-emerald-100 rounded flex items-center justify-center">
                        <span className="text-xs text-emerald-600">✓</span>
                      </div>
                    </div>
                  )}

                  {feature.title === 'WhatsApp Alerts' && (
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                        ✓ Received
                      </div>
                      <div className="px-2 py-1 rounded bg-accent-50 text-accent-600 border border-accent-200">
                        ⚙ In Progress
                      </div>
                      <div className="px-2 py-1 rounded bg-orange-50 text-orange-600 border border-orange-200">
                        🔔 Ready
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Secondary Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {secondaryFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.24 + idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.05 }}
                className="group bg-white rounded-lg p-4 border border-gray-300 shadow-sm hover:border-primary-300 hover:shadow-md hover:shadow-primary-100 transition-all duration-300 cursor-default"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color} group-hover:scale-110 transition-transform`} />
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">
                    {feature.title}
                  </h4>
                  {'desc' in feature && (
                    <p className="text-gray-600 text-xs">{(feature as any).desc}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
