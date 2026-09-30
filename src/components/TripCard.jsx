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
    <div className="flex w-full flex-col gap-4 rounded-xl border border-brand-panel bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-[0.6px] ${status.badge}`}
          >
            <StatusIcon className="size-3.5" />
            {status.label}
          </span>
          <span className="flex items-center gap-1.5 font-body text-sm text-brand-text">
            <CalendarIcon className="size-4" />
            {trip.date} &middot; {trip.time}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <PinIcon className="mt-0.5 size-4 shrink-0 text-brand-red" />
          <div className="font-body text-base text-brand-ink">
            <span>{trip.from}</span>
            <span className="mx-2 text-brand-text">&rarr;</span>
            <span>{trip.to}</span>
          </div>
        </div>

        <p className="font-body text-sm text-brand-text">
          {trip.role === 'driver' ? 'You drove' : 'Driver'}: <span className="text-brand-ink">{trip.withPerson}</span>
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:items-end">
        <p className="font-display text-xl text-brand-red">{trip.price}</p>
        {trip.status === 'upcoming' && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border-2 border-brand-red-dark px-4 py-2 font-body text-sm font-semibold text-brand-red-dark"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTrack}
              className="rounded-lg bg-brand-red px-4 py-2 font-body text-sm font-semibold text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
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

