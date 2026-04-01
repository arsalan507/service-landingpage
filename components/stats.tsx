'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const stats = [
  { number: 15000, label: 'Bikes Serviced', suffix: '+', color: 'from-primary-500 to-blue-500' },
  { number: 500, label: 'Workshops Across India', suffix: '+', color: 'from-accent-500 to-purple-500' },
  { number: 4.8, label: 'Avg Google Rating', suffix: '★', color: 'from-emerald-500 to-green-500' },
  { number: 40, label: 'Cities in India', suffix: '+', color: 'from-orange-500 to-red-500' },
];

function CountUpStat({ target, label, suffix, color }: { target: number; label: string; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2;
    const increment = target / (duration * 60);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="flex flex-col items-center justify-center py-8 md:py-0"
    >
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
        {count}
        {suffix}
      </div>
      <p className="text-gray-700 text-sm sm:text-base text-center">{label}</p>
    </motion.div>
  );
}

export function Stats() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-gray-300 shadow-lg shadow-gray-100 relative overflow-hidden"
        >
          {/* Animated glow */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-emerald-500/10 rounded-3xl blur-xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {stats.map((stat, idx) => (
              <CountUpStat
                key={idx}
                target={stat.number}
                label={stat.label}
                suffix={stat.suffix}
                color={stat.color}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
