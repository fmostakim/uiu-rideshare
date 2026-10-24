import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../assets/images';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',       to: '/'           },
  { label: 'Find Ride',  to: '/find-ride'  },
  { label: 'Offer Ride', to: '/offer-ride' },
  { label: 'My Trips',   to: '/my-trips'   },
  { label: 'Messages',   to: '/messages'   },
];

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.06),0px_2px_4px_-2px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 sm:gap-4 transition-opacity hover:opacity-90">
          <img src={logo} alt="UIU RideShare logo" className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl object-cover shadow-sm" />
          <span className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-brand-red">UIU RideShare</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:gap-12 md:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="font-body text-sm lg:text-base font-medium text-brand-text transition-colors hover:text-brand-red"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex rounded-lg bg-brand-red px-3.5 py-2 text-xs font-semibold tracking-wide text-white transition-opacity hover:opacity-90 shadow-sm"
            >
              Log Out
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg border border-brand-red px-3.5 py-1.5 text-xs font-semibold text-brand-red transition-colors hover:bg-brand-red/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-red px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
              >
                Register
              </Link>
            </div>
          )}

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
        <div className="border-t border-brand-panel bg-white px-4 py-4 shadow-xl md:hidden animate-fadeIn">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 font-body text-base font-medium text-brand-ink transition-colors hover:bg-brand-bg hover:text-brand-red"
              >
                <span>{label}</span>
                <span className="text-gray-400">&rarr;</span>
              </Link>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-brand-panel flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full rounded-lg bg-brand-red py-3 text-center font-body text-sm font-semibold text-white shadow-sm"
              >
                Log Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-brand-red py-2.5 text-center font-body text-sm font-semibold text-brand-red"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-brand-red py-2.5 text-center font-body text-sm font-semibold text-white shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
