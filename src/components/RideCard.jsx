import { iconStar, iconRouteStart, iconRouteEnd, iconCarTag, iconGenderTag, iconAcTag } from '../assets/find-ride-images';

export default function RideCard({ ride, onJoin }) {
  const seatsFilled = ride.totalSeats - ride.seatsAvailable;
  const filledPercent = (seatsFilled / ride.totalSeats) * 100;

  return (
    <div className="flex w-full gap-6 rounded-xl border border-brand-panel bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)]">
      {/* Driver info */}
      <div className="flex w-32 shrink-0 flex-col items-center gap-4 border-r border-[#e4beb9] pr-6 text-center">
        <img
          src={ride.driver.avatar}
          alt={ride.driver.name}
          className="size-20 rounded-full border-2 border-brand-red object-cover"
        />
        <div>
          <p className="font-display text-base text-brand-ink">{ride.driver.name}</p>
          <p className="mt-1 font-body text-xs uppercase tracking-[0.8px] text-brand-text">
            {ride.driver.tag}
          </p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <img src={iconStar} alt="" className="h-3 w-3.5" />
            <span className="font-body text-sm text-[#755700]">{ride.driver.rating}</span>
          </div>
        </div>
      </div>

      {/* Route + amenities */}
      <div className="relative flex flex-1 flex-col justify-between">
        <div
          className="absolute bottom-6 left-[11px] top-6 w-0.5"
          style={{
            backgroundImage:
              'linear-gradient(180deg, #b7131a 0%, #b7131a 50%, rgba(183,19,26,0) 50%, rgba(183,19,26,0) 100%)',
          }}
        />
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <img src={iconRouteStart} alt="" className="mt-0.5 h-6 w-5 shrink-0" />
            <div className="flex-1">
              <p className="font-display text-base text-brand-ink">{ride.from.name}</p>
              <p className="font-body text-base text-brand-text">{ride.from.detail}</p>
            </div>
            <p className="font-display text-base text-brand-red shrink-0">{ride.time}</p>
          </div>
          <div className="flex items-start gap-4">
            <img src={iconRouteEnd} alt="" className="mt-0.5 h-6 w-4 shrink-0" />
            <div>
              <p className="font-display text-base text-brand-ink">{ride.to.name}</p>
              <p className="font-body text-base text-brand-text">{ride.to.detail}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <span className="flex items-center gap-2 rounded-full bg-[#e6eeff] px-3 py-1 font-body text-sm text-brand-ink">
            <img src={iconCarTag} alt="" className="h-3 w-3.5" />
            {ride.vehicle}
          </span>
          <span className="flex items-center gap-2 rounded-full bg-[#e6eeff] px-3 py-1 font-body text-sm text-brand-ink">
            <img src={iconGenderTag} alt="" className="h-3 w-3" />
            {ride.genderPreference}
          </span>
          {ride.acOn && (
            <span className="flex items-center gap-2 rounded-full bg-[#e6eeff] px-3 py-1 font-body text-sm text-brand-ink">
              <img src={iconAcTag} alt="" className="h-3.5 w-3.5" />
              AC On
            </span>
          )}
        </div>
      </div>

      {/* Pricing + CTA */}
      <div className="flex w-48 shrink-0 flex-col items-end justify-between">
        <div className="text-right">
          <p className="font-display text-base text-brand-red">{ride.price}</p>
          <p className="font-body text-base text-brand-text">BDT / Person</p>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-body text-base text-brand-text">Seats Available</span>
            <span className="font-body text-base font-semibold text-brand-red">
              {ride.seatsAvailable}/{ride.totalSeats}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e6eeff]">
            <div className="h-full rounded-full bg-brand-red" style={{ width: `${filledPercent}%` }} />
          </div>
          <button
            type="button"
            onClick={onJoin}
            disabled={ride.seatsAvailable < 1}
            className="w-full rounded-lg bg-brand-red py-3 font-body text-base font-semibold text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ride.seatsAvailable < 1 ? 'Ride Full' : 'Join Ride'}
          </button>
        </div>
      </div>
    </div>
  );
}
