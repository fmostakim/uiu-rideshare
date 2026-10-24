import { useState } from 'react';
import { CalendarIcon, PinIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from './icons';

const STATUS_STYLES = {
  upcoming: {
    badge: 'bg-[#e6eeff] text-brand-red-dark',
    icon: ClockIcon,
    label: 'Upcoming',
  },
  completed: {
    badge: 'bg-[#dcf5e3] text-[#1c7a3e]',
    icon: CheckCircleIcon,
    label: 'Completed',
  },
  cancelled: {
    badge: 'bg-[#fde2e1] text-[#b7131a]',
    icon: XCircleIcon,
    label: 'Cancelled',
  },
};

const STARS = [1, 2, 3, 4, 5];

export default function TripCard({ trip, onCancel }) {
  const status = STATUS_STYLES[trip.status];
  const StatusIcon = status.icon;
  const [tracked, setTracked] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [rated, setRated] = useState(false);

  const handleTrack = () => setTracked(true);
  const handleRate = (star) => {
    setRating(star);
    setRated(true);
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-brand-panel bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2.5 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider ${status.badge}`}
          >
            <StatusIcon className="size-3.5" />
            {status.label}
          </span>
          <span className="flex items-center gap-1.5 font-body text-xs sm:text-sm text-brand-text">
            <CalendarIcon className="size-3.5 sm:size-4" />
            {trip.date} &middot; {trip.time}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <PinIcon className="mt-0.5 size-4 shrink-0 text-brand-red" />
          <div className="font-body text-sm sm:text-base font-semibold text-brand-ink">
            <span>{trip.from}</span>
            <span className="mx-2 text-brand-text">&rarr;</span>
            <span>{trip.to}</span>
          </div>
        </div>

        <p className="font-body text-xs sm:text-sm text-brand-text">
          {trip.role === 'driver' ? 'You drove' : 'Driver'}: <span className="font-medium text-brand-ink">{trip.withPerson}</span>
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 border-t border-[#e4beb9]/40 pt-3 sm:border-t-0 sm:pt-0 sm:items-end">
        <p className="font-display text-lg sm:text-xl font-bold text-brand-red">৳{trip.price}</p>
        {trip.status === 'upcoming' && (
          <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial rounded-xl border border-brand-red-dark px-4 py-2 font-body text-xs sm:text-sm font-semibold text-brand-red-dark transition-all hover:bg-brand-red-dark/5 active:scale-95 text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTrack}
              className="flex-1 sm:flex-initial rounded-xl bg-brand-red px-4 py-2 font-body text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-red-dark active:scale-95 text-center"
            >
              {tracked ? '📍 Tracking…' : 'Track Ride'}
            </button>
          </div>
        )}
        {trip.status === 'completed' && (
          rated ? (
            <p className="font-body text-sm text-[#1c7a3e]">
              ✅ Rated {rating}/5 — Thanks!
            </p>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <p className="font-body text-xs text-brand-text">Rate this trip:</p>
              <div className="flex gap-1">
                {STARS.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="text-xl leading-none transition-transform hover:scale-125"
                  >
                    {star <= (hovered || rating) ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
        {trip.status === 'cancelled' && (
          <p className="font-body text-sm text-brand-text">{trip.note}</p>
        )}
      </div>
    </div>
  );
}

