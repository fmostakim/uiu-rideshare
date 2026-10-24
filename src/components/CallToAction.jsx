import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="mx-auto max-w-[1700px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#27313f] p-6 sm:p-12 lg:p-20">
        <div className="pointer-events-none absolute -left-32 -top-32 size-64 rounded-full bg-brand-red-dark opacity-10" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-brand-red-dark opacity-5" />

        <div className="relative flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#eaf1ff]">
            Ready to transform your commute?
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-gray-300">
            Join thousands of UIU students who commute smarter, cheaper, and safer every day.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => alert('Mobile app is coming soon! Please use the web version for now.')}
              className="rounded-xl bg-brand-red-dark px-6 py-3.5 sm:px-8 sm:py-4 font-display text-base sm:text-lg font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
            >
              Download App
            </button>
            <Link
              to="/register"
              className="rounded-xl border-2 border-[#eaf1ff] px-6 py-3.5 sm:px-8 sm:py-4 font-display text-base sm:text-lg font-semibold text-[#eaf1ff] transition-all hover:bg-white/10 active:scale-95 text-center"
            >
              Become a Driver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
