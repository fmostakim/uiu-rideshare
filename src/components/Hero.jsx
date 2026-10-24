import { Link } from 'react-router-dom';
import { heroBackground } from '../assets/images';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroBackground}
        alt="UIU campus"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="relative mx-auto max-w-[1700px] px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-36">
        <div className="max-w-[896px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-brand-red mb-4 sm:mb-6">
            <span>🎓 Exclusively for UIU Students</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight sm:leading-[1.15] tracking-tight text-brand-ink">
            Travel <span className="text-brand-red-dark">Smart, Safe</span>, and
            <br className="hidden sm:inline" /> Together – UIU Ride Sharing
          </h1>
          <p className="mt-4 sm:mt-6 max-w-[840px] font-body text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-brand-text">
            Connect with fellow UIU students to share rides, reduce costs, and build a safer
            campus community. Your journey starts here.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              to="/find-ride"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3.5 font-display text-base font-semibold text-white shadow-lg shadow-brand-red/25 transition-all hover:bg-brand-red-dark active:scale-95"
            >
              <span>🔍 Find a Ride</span>
            </Link>
            <Link
              to="/offer-ride"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-brand-red-dark bg-white/80 backdrop-blur-sm px-6 py-3.5 font-display text-base font-semibold text-brand-red-dark transition-all hover:bg-white active:scale-95 shadow-sm"
            >
              <span>🚗 Offer a Ride</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
