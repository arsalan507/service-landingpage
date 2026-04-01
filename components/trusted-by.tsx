'use client';

import { motion } from 'framer-motion';

const shops = [
  { name: 'Bharath Cycle Hub, Bangalore', initials: 'BC' },
  { name: 'SR Motors, Hyderabad', initials: 'SR' },
  { name: 'Nandini Two Wheelers, Chennai', initials: 'NT' },
  { name: 'Royal Rides, Delhi', initials: 'RR' },
  { name: 'Speed Gear, Mumbai', initials: 'SG' },
  { name: 'City Bikes, Pune', initials: 'CB' },
  { name: 'Moto Care, Ahmedabad', initials: 'MC' },
  { name: 'Rider Hub, Kochi', initials: 'RH' },
];

export function TrustedBy() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-8"
        >
          <p className="text-center text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-gray-700">
            Trusted by Service Centers Across India
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {shops.map((shop, idx) => (
              <motion.div
                key={shop.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm text-gray-800 text-xs sm:text-sm hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                  {shop.initials.charAt(0)}
                </div>
                {shop.name}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
