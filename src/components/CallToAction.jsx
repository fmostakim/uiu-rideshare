import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="mx-auto max-w-[1700px] px-12 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-[#27313f] p-24">
        <div className="pointer-events-none absolute -left-32 -top-32 size-64 rounded-full bg-brand-red-dark opacity-10" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-brand-red-dark opacity-5" />

        <div className="relative flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-5xl font-bold tracking-[-0.96px] text-[#eaf1ff]">
            Ready to transform your commute?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => alert('Mobile app is coming soon! Please use the web version for now.')}
              className="rounded-lg bg-brand-red-dark px-8 py-6 font-display text-xl font-semibold text-white transition-opacity hover:opacity-90"
            >
              Download App
            </button>
            <Link
              to="/register"
              className="rounded-lg border-2 border-[#eaf1ff] px-[34px] py-[26px] font-display text-xl font-semibold text-[#eaf1ff] transition-colors hover:bg-white/10"
            >
              Become a Driver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
