import { CalendarIcon, LeafIcon, WalletIcon, StarIcon } from './icons';

const buildCards = (summary) => [
  { label: 'Total Trips', value: summary ? String(summary.totalTrips) : '—', icon: CalendarIcon },
  { label: 'CO2 Saved', value: summary ? `${summary.co2SavedKg} kg` : '—', icon: LeafIcon },
  {
    label: 'Money Spent',
    value: summary ? `৳${summary.moneySaved.toLocaleString()}` : '—',
    icon: WalletIcon,
  },
  { label: 'Completed', value: summary ? String(summary.completedTrips) : '—', icon: StarIcon },
];

export default function TripSummaryBento({ summary }) {
  const SUMMARY = buildCards(summary);

  return (
    <div className="grid grid-cols-2 gap-4 rounded-xl border border-brand-panel bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] md:grid-cols-4">
      {SUMMARY.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[rgba(183,19,26,0.1)]">
            <Icon className="size-5 text-brand-red-dark" />
          </span>
          <div>
            <p className="font-display text-xl font-bold text-brand-ink">{value}</p>
            <p className="font-body text-xs uppercase tracking-[0.6px] text-brand-text">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
