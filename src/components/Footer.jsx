const FOOTER_LINKS = ['Safety Guidelines', 'Terms of Service', 'Support', 'Privacy Policy'];

export default function Footer() {
  return (
    <footer className="bg-brand-panel pb-20 md:pb-6">
      <div className="mx-auto flex max-w-[1536px] flex-col items-center justify-between gap-4 px-4 py-6 sm:px-8 md:flex-row lg:px-12 text-center md:text-left">
        <div>
          <p className="font-display text-lg sm:text-xl font-bold text-brand-ink">UIU RideShare</p>
          <p className="mt-0.5 font-body text-xs sm:text-sm text-brand-text">
            &copy; 2026 UIU RideShare. Student Safety First.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {FOOTER_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`${label} page is coming soon!`);
              }}
              className="font-body text-xs sm:text-sm text-brand-text hover:text-brand-red-dark transition-colors py-1"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
