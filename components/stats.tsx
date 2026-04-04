'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { number: 15000, label: 'Bikes Serviced', suffix: '+', color: 'text-blue-600' },
  { number: 500, label: 'Workshops Across India', suffix: '+', color: 'text-violet-600' },
  { number: 4.8, label: 'Avg Google Rating', suffix: '★', color: 'text-emerald-600' },
  { number: 40, label: 'Cities in India', suffix: '+', color: 'text-orange-600' },
];

function CountUpStat({ target, label, suffix, color }: { target: number; label: string; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const duration = 1500;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;

          setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(target);
          }
        };

        requestAnimationFrame(animate);
      },
      { rootMargin: '-50px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const display = target % 1 !== 0 ? count.toFixed(1) : count.toLocaleString('en-IN');

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-6 md:py-0">
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${color} mb-2`}>
        {display}{suffix}
      </div>
      <p className="text-gray-700 text-sm sm:text-base text-center">{label}</p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-300 shadow-lg shadow-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
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
        </div>
      </div>
    </section>
  );
}
