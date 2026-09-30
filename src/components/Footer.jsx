const FOOTER_LINKS = ['Safety Guidelines', 'Terms of Service', 'Support', 'Privacy Policy'];

export default function Footer() {
  return (
    <footer className="bg-brand-panel">
      <div className="mx-auto flex max-w-[1536px] flex-col items-center justify-between gap-6 px-12 py-6 md:flex-row">
        <div>
          <p className="font-display text-xl font-bold text-brand-ink">UIU RideShare</p>
          <p className="font-body text-sm text-brand-text">
            © 2026 UIU RideShare. Student Safety First.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {FOOTER_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`${label} page is coming soon!`);
              }}
              className="font-body text-sm text-brand-text hover:text-brand-red-dark"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
