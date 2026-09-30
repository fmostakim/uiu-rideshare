import {
  avatarSafety1,
  avatarSafety2,
  avatarSafety3,
  mapPreview,
  iconArrow,
  iconShield,
  iconWallet,
  iconPin,
} from '../assets/images';

export default function Features() {
  return (
    <section className="mx-auto max-w-[1700px] px-12 py-16">
      <div className="mx-auto max-w-[720px] text-center">
        <h2 className="font-display text-3xl font-bold text-brand-ink">
          Why Choose UIU RideShare?
        </h2>
        <p className="mt-2 font-body text-base text-brand-text">
          Built exclusively for United International University students.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-12 grid-rows-[240px_340px] gap-6">
        {/* Primary: Safety */}
        <div className="col-span-8 row-start-1 flex flex-col justify-between rounded-xl border border-[rgba(228,190,185,0.3)] bg-[#dee9fc] p-6">
          <div>
            <div className="flex size-12 items-center justify-center rounded-full bg-[rgba(183,19,26,0.1)]">
              <img src={iconShield} alt="" className="h-5 w-4" />
            </div>
            <h3 className="mt-2 font-display text-3xl font-bold text-brand-ink">
              Student Safety First
            </h3>
            <p className="mt-2 max-w-[512px] font-body text-base text-brand-text">
              Every rider and driver is a verified UIU student. Ride with peace of mind knowing
              you&apos;re traveling within your campus community.
            </p>
          </div>
          <div className="flex items-center">
            {[avatarSafety1, avatarSafety2, avatarSafety3].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="-mr-4 size-12 rounded-full border-2 border-brand-bg object-cover"
              />
            ))}
            <div className="flex size-12 items-center justify-center rounded-full border-2 border-brand-bg bg-brand-red-dark text-xs font-semibold text-white">
              +2k
            </div>
          </div>
        </div>

        {/* Side: Cost */}
        <div className="col-span-4 row-start-1 flex flex-col justify-between rounded-xl border border-[rgba(228,190,185,0.3)] bg-[#ffdf9e] p-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-[rgba(117,87,0,0.1)]">
            <img src={iconWallet} alt="" className="h-4 w-[22px]" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-[#261a00]">Split Costs</h3>
            <p className="mt-2 font-body text-sm text-[#5b4300]">
              Share the fuel and toll costs. Travel smart and keep your pocket money safe.
            </p>
          </div>
        </div>

        {/* Feature: Live tracking */}
        <div className="col-span-4 row-start-2 flex flex-col justify-between rounded-xl border border-[rgba(228,190,185,0.3)] bg-[rgba(253,110,96,0.2)] p-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-[rgba(172,51,42,0.1)]">
            <img src={iconPin} alt="" className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-brand-ink">Live Tracking</h3>
            <p className="mt-2 font-body text-sm text-brand-text">
              Real-time GPS tracking for every ride. Share your status with friends easily.
            </p>
          </div>
        </div>

        {/* Map preview */}
        <div className="relative col-span-8 row-start-2 overflow-hidden rounded-xl border border-[rgba(228,190,185,0.3)] bg-[#d9e3f6]">
          <img src={mapPreview} alt="Campus route map" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="relative flex h-full items-center bg-gradient-to-r from-[#d9e3f6] to-[rgba(217,227,246,0)] p-6">
            <div className="max-w-[320px]">
              <h3 className="font-display text-3xl font-bold text-brand-ink">Campus Routes</h3>
              <p className="mt-2 font-body text-sm text-brand-text">
                Frequent rides from Badda, Bashundhara, and Malibagh areas directly to UIU.
              </p>
              <a href="#" className="mt-2 inline-flex items-center gap-1 font-body text-base font-semibold text-brand-red-dark">
                View Map
                <img src={iconArrow} alt="" className="size-[9px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
