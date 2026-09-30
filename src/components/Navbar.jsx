import { Link } from 'react-router-dom';
import { logo } from '../assets/images';

const NAV_LINKS = ['Home', 'Find Ride', 'Offer Ride', 'My Trips', 'Messages'];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-brand-bg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-8 px-12 py-8">
        <div className="flex items-center gap-6">
          <img src={logo} alt="UIU RideShare logo" className="h-[68px] w-[68px] rounded-[10px] object-cover" />
          <span className="font-display text-3xl font-bold text-brand-red">UIU RideShare</span>
        </div>

        <nav className="hidden items-center gap-[60px] md:flex">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="font-body text-base text-brand-text transition-colors hover:text-brand-red"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="rounded-lg border-2 border-brand-red px-[18px] py-[10px] text-xs font-medium tracking-[0.6px] text-brand-red"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-brand-red px-4 py-2 text-xs font-medium tracking-[0.6px] text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
