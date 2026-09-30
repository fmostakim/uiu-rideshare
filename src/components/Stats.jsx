const STATS = [
  { value: '5,000+', label: 'Student Users' },
  { value: '12,000+', label: 'Rides Completed' },
  { value: '2 Tons', label: 'CO2 Saved' },
  { value: '4.9/5', label: 'Safety Rating' },
];

export default function Stats() {
  return (
    <section className="bg-white px-12 py-8">
      <div className="mx-auto grid max-w-[1700px] grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-5xl font-bold tracking-[-0.96px] text-brand-red-dark">
              {stat.value}
            </p>
            <p className="mt-1 font-body text-xs font-medium uppercase tracking-[0.6px] text-brand-text">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
