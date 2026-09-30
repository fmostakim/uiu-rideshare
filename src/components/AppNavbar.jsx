import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logo } from '../assets/images';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Find Ride', to: '/find-ride' },
  { label: 'Offer Ride', to: '/offer-ride' },
  { label: 'My Trips', to: '/my-trips' },
  { label: 'Messages', to: '/messages' },
];

export default function AppNavbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-bg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-8 px-12 py-8">
        <div className="flex items-center gap-6">
          <img src={logo} alt="UIU RideShare logo" className="h-[68px] w-[68px] rounded-[10px] object-cover" />
          <span className="font-display text-3xl font-bold text-brand-red md:text-4xl">UIU RideShare</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[60px] md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={
                  active
                    ? 'border-b-2 border-brand-red pb-1 font-body text-base font-semibold text-brand-red'
                    : 'font-body text-base text-brand-text transition-colors hover:text-brand-red'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden font-body text-sm text-brand-text lg:inline">
              {user.fullName}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-brand-red px-4 py-2 text-xs font-medium tracking-[0.6px] text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
          >
            Log Out
          </button>

          {/* Hamburger button — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-brand-ink transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-brand-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-brand-ink transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="flex flex-col gap-0 border-t border-brand-panel bg-white px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-[#f0f0f0] py-3 font-body text-base ${
                  active ? 'font-semibold text-brand-red' : 'text-brand-text'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
