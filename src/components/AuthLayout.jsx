import { authBackground } from '../assets/auth-images';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <img
        src={authBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-3 py-6 sm:px-4 sm:py-12">
        {children}
        <p className="text-center font-body text-xs font-medium uppercase tracking-[0.6px] text-[#410002] opacity-90">
          &copy; 2026 UIU RideShare. Student Safety First.
        </p>
      </div>
    </div>
  );
}
