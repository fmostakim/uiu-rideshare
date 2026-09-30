import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import { iconLock, iconGraduationCap } from '../assets/auth-images';
import { logo } from '../assets/images';

export default function Login() {
  const [role, setRole] = useState('passenger'); // 'passenger' | 'driver'
  const [studentId, setStudentId] = useState('0112330002');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Auto-fill test accounts from seed data for easy login during presentation
    setStudentId(newRole === 'driver' ? '0112330001' : '0112330002');
    setPassword('password123');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ studentId, password });
      navigate(location.state?.from ?? '/find-ride', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[448px] rounded-xl border border-[rgba(228,190,185,0.3)] bg-white p-[33px] shadow-[0px_4px_6px_rgba(0,0,0,0.05),0px_8px_16px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-center pb-2">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-[27px] w-[30px] rounded" />
            <h1 className="font-display text-3xl font-bold tracking-[-0.8px] text-brand-red">
              UIU RideShare
            </h1>
          </div>
          <p className="font-body text-base text-brand-text">Welcome Back</p>
        </div>

        {/* Role toggle */}
        <div className="mt-6 flex rounded-lg border border-[#e4beb9] bg-brand-bg p-[5px]">
          <button
            type="button"
            onClick={() => handleRoleChange('passenger')}
            className={`flex-1 rounded-md px-4 py-2 font-body text-sm font-semibold transition-colors ${
              role === 'passenger' ? 'bg-brand-red-dark text-white' : 'text-brand-text'
            }`}
          >
            Passenger
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('driver')}
            className={`flex-1 rounded-md px-4 py-2 font-body text-sm font-semibold transition-colors ${
              role === 'driver' ? 'bg-brand-red-dark text-white' : 'text-brand-text'
            }`}
          >
            Driver
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-6" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg bg-[#fde2e1] px-4 py-3 font-body text-sm text-brand-red-dark">
              {error}
            </p>
          )}

          <FormField
            label="Student ID"
            icon={iconGraduationCap}
            placeholder="011XXXXXXX"
            name="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            <FormField
              label="Password"
              icon={iconLock}
              type="password"
              placeholder="••••••••"
              toggleablePassword
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 font-body text-sm text-brand-text">
                <input type="checkbox" className="size-4 rounded border-[#e4beb9]" />
                Remember me
              </label>
              <a href="#" className="font-body text-xs font-semibold tracking-[0.6px] text-brand-red-dark">
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-red py-4 font-display text-base text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <Link
          to="/register"
          className="mt-6 flex items-center justify-center gap-2 rounded-lg border-2 border-brand-red-dark py-[18px] font-display text-base text-brand-red-dark"
        >
          Sign up with UIU ID
        </Link>

        <p className="mt-6 text-center font-body text-sm text-brand-text">
          By logging in, you agree to our{' '}
          <a href="#" className="text-brand-red-dark">
            Community Guidelines
          </a>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
