'use client';

const shops = [
  { name: 'Bharath Cycle Hub', city: 'Bangalore' },
  { name: 'SR Motors', city: 'Hyderabad' },
  { name: 'Nandini Two Wheelers', city: 'Chennai' },
  { name: 'Royal Rides', city: 'Delhi' },
  { name: 'Speed Gear', city: 'Mumbai' },
  { name: 'City Bikes', city: 'Pune' },
  { name: 'Moto Care', city: 'Ahmedabad' },
  { name: 'Rider Hub', city: 'Kochi' },
];

export function TrustedBy() {
  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <p className="text-center text-[10px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold text-gray-700">
          Trusted by Service Centers Across India
        </p>

        {/* Mobile: 2-col grid | Desktop: flex wrap */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          {shops.map((shop) => (
            <div
              key={shop.name}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white border border-gray-300 shadow-sm"
            >
              <div className="w-5 h-5 rounded bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                {shop.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 text-[11px] font-medium truncate">{shop.name}</p>
                <p className="text-gray-500 text-[9px]">{shop.city}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: flex wrap */}
        <div className="hidden sm:flex flex-wrap justify-center gap-3">
          {shops.map((shop) => (
            <div
              key={shop.name}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-sm text-sm text-gray-800"
            >
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                {shop.name.charAt(0)}
              </div>
              {shop.name}, {shop.city}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
