'use client';

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
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col border border-gray-300 shadow-md shadow-gray-100 min-w-[260px] w-[280px] sm:w-[340px] lg:w-[360px] flex-shrink-0">
      <div className="flex gap-0.5 mb-2 sm:mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-gray-800 text-xs sm:text-sm mb-3 sm:mb-5 flex-1 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="flex items-center gap-2.5 pt-3 border-t border-gray-300">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0">
          {initials.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 text-xs sm:text-sm font-semibold truncate">{author}</p>
          <p className="text-gray-700 text-[11px] sm:text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gray-50/60"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5 sm:mb-8">
          <h2 className="font-display text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Trusted by Workshops Across India
          </h2>
          <p className="text-amber-600 font-medium text-xs sm:text-sm italic mt-2 sm:mt-3">
            &quot;Logon ki sunn lo — 2XG ne unka kaam aasan kar diya.&quot;
          </p>
        </div>

        {/* Horizontal scroll on all screen sizes */}
        <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} style={{ scrollSnapAlign: 'start' }}>
                <TestimonialCard
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  initials={testimonial.initials}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
