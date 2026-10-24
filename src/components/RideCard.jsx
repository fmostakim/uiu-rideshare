import { useNavigate } from 'react-router-dom';
import { iconStar, iconRouteStart, iconRouteEnd, iconCarTag, iconGenderTag, iconAcTag } from '../assets/find-ride-images';

export default function RideCard({ ride, onJoin }) {
  const navigate = useNavigate();
  const seatsFilled = ride.totalSeats - ride.seatsAvailable;
  const filledPercent = (seatsFilled / ride.totalSeats) * 100;

  return (
    <div className="flex w-full flex-col md:flex-row gap-4 sm:gap-6 rounded-2xl border border-brand-panel bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Mobile-only Header Row (Driver Avatar, Name, and Price) */}
      <div className="flex items-center justify-between border-b border-[#e4beb9]/50 pb-3 md:hidden">
        <div className="flex items-center gap-3">
          <img
            src={ride.driver.avatar}
            alt={ride.driver.name}
            className="size-12 rounded-full border-2 border-brand-red object-cover shadow-sm"
          />
          <div>
            <p className="font-display text-sm font-bold text-brand-ink">{ride.driver.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-body text-[11px] font-medium uppercase tracking-wider text-brand-text">
                {ride.driver.tag}
              </span>
              <span className="text-gray-300">&middot;</span>
              <div className="flex items-center gap-1">
                <img src={iconStar} alt="" className="size-3" />
                <span className="font-body text-xs font-semibold text-[#755700]">{ride.driver.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-lg font-bold text-brand-red">৳{ride.price}</p>
          <p className="font-body text-[11px] text-brand-text">per seat</p>
        </div>
      </div>

      {/* Desktop Driver Info */}
      <div className="hidden md:flex w-32 shrink-0 flex-col items-center gap-3 border-r border-[#e4beb9] pr-6 text-center">
        <img
          src={ride.driver.avatar}
          alt={ride.driver.name}
          className="size-16 lg:size-20 rounded-full border-2 border-brand-red object-cover shadow-sm"
        />
        <div>
          <p className="font-display text-sm lg:text-base font-bold text-brand-ink">{ride.driver.name}</p>
          <p className="mt-0.5 font-body text-xs uppercase tracking-wider text-brand-text">
            {ride.driver.tag}
          </p>
          <div className="mt-1.5 flex items-center justify-center gap-1">
            <img src={iconStar} alt="" className="h-3 w-3.5" />
            <span className="font-body text-xs font-semibold text-[#755700]">{ride.driver.rating}</span>
          </div>
        </div>
      </div>

      {/* Route + Amenities */}
      <div className="relative flex flex-1 flex-col justify-between py-1 md:py-0">
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex items-start gap-3">
            <img src={iconRouteStart} alt="" className="mt-1 h-5 w-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm sm:text-base font-bold text-brand-ink">{ride.from.name}</p>
              {ride.from.detail && (
                <p className="truncate font-body text-xs sm:text-sm text-brand-text">{ride.from.detail}</p>
              )}
            </div>
            <span className="rounded-full bg-brand-red/10 px-2.5 py-1 font-display text-xs sm:text-sm font-semibold text-brand-red shrink-0">
              {ride.time}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <img src={iconRouteEnd} alt="" className="mt-1 h-5 w-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm sm:text-base font-bold text-brand-ink">{ride.to.name}</p>
              {ride.to.detail && (
                <p className="truncate font-body text-xs sm:text-sm text-brand-text">{ride.to.detail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-2.5 py-1 font-body text-xs font-medium text-brand-ink">
            <img src={iconCarTag} alt="" className="h-2.5 w-3" />
            {ride.vehicle}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-2.5 py-1 font-body text-xs font-medium text-brand-ink">
            <img src={iconGenderTag} alt="" className="h-2.5 w-2.5" />
            {ride.genderPreference}
          </span>
          {ride.acOn && (
            <span className="flex items-center gap-1.5 rounded-full bg-[#e6eeff] px-2.5 py-1 font-body text-xs font-medium text-brand-ink">
              <img src={iconAcTag} alt="" className="h-3 w-3" />
              AC On
            </span>
          )}
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="flex w-full md:w-48 shrink-0 flex-col justify-between pt-3 border-t border-[#e4beb9]/50 md:border-t-0 md:pt-0">
        <div className="hidden md:block text-right">
          <p className="font-display text-xl font-bold text-brand-red">৳{ride.price}</p>
          <p className="font-body text-xs text-brand-text">BDT / Person</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm pb-1.5">
              <span className="font-body text-brand-text">Available Seats</span>
              <span className="font-body font-semibold text-brand-red">
                {ride.seatsAvailable}/{ride.totalSeats} left
              </span>
            </div>
            <div className="h-1.5 sm:h-2 overflow-hidden rounded-full bg-[#e6eeff]">
              <div className="h-full rounded-full bg-brand-red transition-all" style={{ width: `${filledPercent}%` }} />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/messages?startChat=${ride.driverId}`);
              }}
              className="flex-1 rounded-xl border border-brand-red bg-white py-2.5 font-body text-xs sm:text-sm font-semibold text-brand-red transition-all hover:bg-brand-red hover:text-white active:scale-95 text-center"
            >
              Message
            </button>
            <button
              type="button"
              onClick={onJoin}
              disabled={ride.seatsAvailable < 1}
              className="flex-1 rounded-xl bg-brand-red py-2.5 font-body text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-red-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 text-center"
            >
              {ride.seatsAvailable < 1 ? 'Full' : 'Join'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
