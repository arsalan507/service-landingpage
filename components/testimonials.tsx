'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'Before 2XG, customers used to argue about bills every day. Now they see photos of every part changed. Zero complaints in 3 months!',
    author: 'Rajesh Kumar',
    role: 'Workshop Owner, Bangalore',
    initials: 'RK',
  },
  {
    quote: 'Setup took 2 minutes. Same day, a customer said "finally a shop I can trust." That one moment made it worth it.',
    author: 'Bharath Reddy',
    role: 'Shop Owner, Hyderabad',
    initials: 'BR',
  },
  {
    quote: 'I used to waste 30 minutes calling the mechanic for updates. Now I get WhatsApp photos automatically. This is how every shop should work.',
    author: 'Priya Sharma',
    role: 'Bike Owner, Delhi',
    initials: 'PS',
  },
  {
    quote: 'My Google reviews went from 3.2 to 4.7 stars in just 2 months. The auto-review feature is a game changer for small workshops.',
    author: 'Mohammed Irfan',
    role: 'Workshop Owner, Mumbai',
    initials: 'MI',
  },
  {
    quote: 'We handle 40+ bikes daily. 2XG replaced our register book completely. Digital bills save us ₹5000/month on printing alone.',
    author: 'Deepa Nair',
    role: 'Manager, Kochi',
    initials: 'DN',
  },
  {
    quote: 'Managing 3 shops was a nightmare. Now I see all jobs live from my phone. Best ₹499 I spend every month. And the first month was just ₹249!',
    author: 'Suresh Patel',
    role: 'Chain Owner, Ahmedabad',
    initials: 'SP',
  },
];

function TestimonialCard({ quote, author, role, initials }: { quote: string; author: string; role: string; initials: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 min-w-[320px] w-full flex flex-col border border-gray-300 shadow-md shadow-gray-100 hover:border-gray-300 hover:shadow-lg transition-all"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-gray-800 text-sm mb-6 flex-1 leading-relaxed">
        "{quote}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-300">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          {initials.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 text-sm font-semibold truncate">{author}</p>
          <p className="text-gray-700 text-xs">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  // Create duplicates for seamless marquee
  const row1 = testimonials.slice(0, 3);
  const row2 = testimonials.slice(3, 6);
  const row1Extended = [...row1, ...row1, ...row1, ...row1];
  const row2Extended = [...row2, ...row2, ...row2, ...row2];

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-50/60"
    >
      <div className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Trusted by Workshops Across India
          </h2>
          <p className="text-amber-600 font-medium text-sm italic mt-4">
            &quot;Logon ki sunn lo — 2XG ne unka kaam aasan kar diya.&quot;
          </p>
        </motion.div>
      </div>

      {/* Row 1 */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />

        <div className="flex gap-4 overflow-hidden">
          <div className="marquee flex gap-4 shrink-0">
            {row1Extended.map((testimonial, idx) => (
              <TestimonialCard
                key={`${idx}`}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                initials={testimonial.initials}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />

        <div className="flex gap-4 overflow-hidden">
          <div className="marquee-reverse flex gap-4 shrink-0">
            {row2Extended.map((testimonial, idx) => (
              <TestimonialCard
                key={`${idx}`}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                initials={testimonial.initials}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
