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
    <header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.06),0px_2px_4px_-2px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
        <Link to="/" className="flex items-center gap-3 sm:gap-4 transition-opacity hover:opacity-90">
          <img src={logo} alt="UIU RideShare logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-sm" />
          <span className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-brand-red">UIU RideShare</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:gap-10 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={
                  active
                    ? 'border-b-2 border-brand-red pb-1 font-body text-sm lg:text-base font-semibold text-brand-red'
                    : 'font-body text-sm lg:text-base text-brand-text transition-colors hover:text-brand-red'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <span className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-brand-red font-display text-xs sm:text-sm font-bold text-white shadow-sm">
                {user.fullName ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
              </span>
              <span className="hidden font-body text-sm font-medium text-brand-ink lg:inline">
                {user.fullName}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:inline-flex rounded-lg bg-brand-red px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white transition-opacity hover:opacity-90 shadow-sm"
          >
            Log Out
          </button>

          {/* Hamburger button — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-panel bg-white p-2 text-brand-ink md:hidden transition-colors hover:bg-brand-panel/30"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className={`block h-0.5 w-full bg-brand-ink transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-full bg-brand-ink transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-brand-ink transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-brand-panel bg-white px-4 py-4 shadow-xl md:hidden">
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-brand-bg p-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-red font-display text-sm font-bold text-white">
                {user.fullName ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
              </span>
              <div>
                <p className="font-display text-sm font-bold text-brand-ink">{user.fullName}</p>
                <p className="font-body text-xs text-brand-text">ID: {user.studentId} &middot; {user.role === 'driver' ? 'Driver' : 'Passenger'}</p>
              </div>
            </div>
          )}
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 font-body text-base transition-colors ${
                    active ? 'bg-brand-red/10 font-semibold text-brand-red' : 'text-brand-text hover:bg-brand-bg hover:text-brand-red'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="size-2 rounded-full bg-brand-red" />}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 pt-3 border-t border-brand-panel">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full rounded-lg bg-brand-red py-2.5 text-center font-body text-sm font-semibold text-white shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
