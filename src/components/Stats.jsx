const STATS = [
  { value: '5,000+', label: 'Student Users' },
  { value: '12,000+', label: 'Rides Completed' },
  { value: '2 Tons', label: 'CO2 Saved' },
  { value: '4.9/5', label: 'Safety Rating' },
];

export default function Stats() {
  return (
    <section className="bg-white px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto grid max-w-[1700px] grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center p-2">
            <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-red-dark">
              {stat.value}
            </p>
            <p className="mt-1 sm:mt-2 font-body text-xs sm:text-sm font-medium uppercase tracking-wider text-brand-text">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
