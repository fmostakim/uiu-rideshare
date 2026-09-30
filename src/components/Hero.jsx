import { heroBackground } from '../assets/images';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroBackground}
        alt="UIU campus"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="relative mx-auto max-w-[1700px] px-12 py-[200px]">
        <div className="max-w-[896px]">
          <h1 className="font-display text-5xl font-bold leading-[56px] tracking-[-0.96px] text-brand-ink">
            Travel <span className="text-brand-red-dark">Smart, Safe</span>, and
            <br />
            Together – UIU Ride Sharing
          </h1>
          <p className="mt-7 max-w-[840px] font-body text-2xl leading-normal text-brand-text">
            Connect with fellow UIU students to share rides, reduce costs, and build a safer
            campus community. Your journey starts here.
          </p>
        </div>
      </div>
    </section>
  );
}
