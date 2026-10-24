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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 rounded-2xl border border-brand-panel bg-white p-3.5 sm:p-6 shadow-sm sm:grid-cols-4">
      {SUMMARY.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-full bg-[rgba(183,19,26,0.1)]">
            <Icon className="size-4 sm:size-5 text-brand-red-dark" />
          </span>
          <div>
            <p className="font-display text-base sm:text-xl font-bold text-brand-ink">{value}</p>
            <p className="font-body text-[10px] sm:text-xs uppercase tracking-wider text-brand-text">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
