import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const items = [
    {
      to: '/find-ride',
      label: 'Find',
      icon: (active) => (
        <svg className={`size-5 transition-transform ${active ? 'scale-110 text-brand-red' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      ),
    },
    {
      to: '/offer-ride',
      label: 'Offer',
      icon: (active) => (
        <svg className={`size-5 transition-transform ${active ? 'scale-110 text-brand-red' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      to: '/my-trips',
      label: 'Trips',
      icon: (active) => (
        <svg className={`size-5 transition-transform ${active ? 'scale-110 text-brand-red' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
        </svg>
      ),
    },
    {
      to: '/messages',
      label: 'Chat',
      icon: (active) => (
        <svg className={`size-5 transition-transform ${active ? 'scale-110 text-brand-red' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-panel/60 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
      <div className="grid grid-cols-4 items-center px-2 py-1.5 safe-area-pb">
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                active ? 'text-brand-red font-semibold' : 'text-gray-500 hover:text-brand-ink'
              }`}
            >
              <div className="relative">
                {item.icon(active)}
              </div>
              <span className="text-[10px] tracking-wide mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
