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

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [resetId, setResetId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStatus, setResetStatus] = useState(''); // '' | 'sending' | 'sent' | 'resetting' | 'success'
  const [resetError, setResetError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (!resetId.trim()) return;
    setResetStatus('sending');
    try {
      // Use standard fetch if api client is not imported, wait we have api client? No, this component doesn't import api client directly. It uses useAuth. Let's import api client. Wait, I will just use fetch to be safe.
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: resetId })
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      setResetStatus('sent');
    } catch (err) {
      setResetError(err.message);
      setResetStatus('');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (!otp.trim() || !newPassword.trim()) return;
    setResetStatus('resetting');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: resetId, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setResetStatus('success');
    } catch (err) {
      setResetError(err.message);
      setResetStatus('sent');
    }
  };

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
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setResetStatus('');
                  setResetId('');
                }}
                className="font-body text-xs font-semibold tracking-[0.6px] text-brand-red-dark hover:underline"
              >
                Forgot Password?
              </button>
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

        {/* Demo Helper */}
        <div className="mt-8 flex justify-center gap-2 border-t border-brand-panel pt-4">
          <button
            type="button"
            onClick={() => {
              setStudentId('0112330099');
              setPassword('password123');
            }}
            className="rounded-full bg-pink-100 px-3 py-1 font-body text-xs font-semibold text-pink-700"
          >
            Ayesha (Female)
          </button>
          <button
            type="button"
            onClick={() => {
              setStudentId('0112330088');
              setPassword('password123');
            }}
            className="rounded-full bg-blue-100 px-3 py-1 font-body text-xs font-semibold text-blue-700"
          >
            Rahim (Male)
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            {resetStatus === 'success' ? (
              <div className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#dcf5e3] mb-4">
                  <svg className="size-6 text-[#1c7a3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-brand-ink">Password Updated</h3>
                <p className="mt-2 font-body text-sm text-brand-text">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setResetStatus('');
                    setResetId('');
                    setOtp('');
                    setNewPassword('');
                  }}
                  className="mt-6 w-full rounded-lg bg-brand-red py-3 font-body text-sm font-semibold text-white"
                >
                  Back to Login
                </button>
              </div>
            ) : resetStatus === 'sent' || resetStatus === 'resetting' ? (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <h3 className="font-display text-xl font-bold text-brand-ink">Enter OTP</h3>
                <p className="font-body text-sm text-brand-text">
                  We sent a 4-digit OTP to your email. Please enter it below along with your new password.
                </p>
                
                {resetError && (
                  <p className="rounded-lg bg-[#fde2e1] px-3 py-2 font-body text-xs text-brand-red-dark">
                    {resetError}
                  </p>
                )}

                <div className="flex flex-col gap-3 mt-2">
                  <FormField
                    label="4-Digit OTP"
                    icon={iconLock}
                    placeholder="e.g. 1234"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <FormField
                    label="New Password"
                    icon={iconLock}
                    type="password"
                    placeholder="••••••••"
                    toggleablePassword
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStatus('');
                      setResetError('');
                    }}
                    className="flex-1 rounded-lg border border-brand-panel bg-white py-3 font-body text-sm font-semibold text-brand-ink transition-colors hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={resetStatus === 'resetting' || !otp.trim() || !newPassword.trim()}
                    className="flex-1 rounded-lg bg-brand-red py-3 font-body text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {resetStatus === 'resetting' ? 'Saving...' : 'Update'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                <h3 className="font-display text-xl font-bold text-brand-ink">Reset Password</h3>
                <p className="font-body text-sm text-brand-text">
                  Enter your Student ID and we will send an OTP to your email.
                </p>
                
                {resetError && (
                  <p className="rounded-lg bg-[#fde2e1] px-3 py-2 font-body text-xs text-brand-red-dark">
                    {resetError}
                  </p>
                )}

                <div className="mt-2">
                  <FormField
                    label="Student ID"
                    icon={iconGraduationCap}
                    placeholder="011XXXXXXX"
                    name="resetId"
                    value={resetId}
                    onChange={(e) => setResetId(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setResetError('');
                    }}
                    className="flex-1 rounded-lg border border-brand-panel bg-white py-3 font-body text-sm font-semibold text-brand-ink transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetStatus === 'sending' || !resetId.trim()}
                    className="flex-1 rounded-lg bg-brand-red py-3 font-body text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {resetStatus === 'sending' ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
