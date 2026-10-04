import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import {
  iconUser,
  iconIdCard,
  iconPhone,
  iconMail,
  iconCar,
  iconPlate,
  iconLock,
  iconLockConfirm,
  iconChevronDown,
} from '../assets/auth-images';

const EMPTY_FORM = {
  fullName: '',
  studentId: '',
  gender: 'Male',
  phone: '',
  email: '',
  vehicleType: 'Car',
  vehicleReg: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [role, setRole] = useState('driver'); // 'driver' | 'passenger'
  const isDriver = role === 'driver';

  const [form, setForm] = useState(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please accept the Safety Guidelines and Terms of Service.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName,
        studentId: form.studentId,
        gender: form.gender,
        phone: form.phone,
        email: form.email,
        password: form.password,
        role,
        vehicle: isDriver ? { type: form.vehicleType, registration: form.vehicleReg } : null,
      });
      navigate('/find-ride', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[576px] overflow-hidden rounded-lg border border-white/20 bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col items-center gap-1 px-8 pb-4 pt-8">
          <h1 className="font-display text-3xl font-bold text-brand-red">Join the Community</h1>
          <p className="font-body text-sm text-brand-text">
            Connect with fellow students for safe, reliable campus commutes.
          </p>
        </div>

        <form className="flex flex-col gap-4 px-8 pb-10" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg bg-[#fde2e1] px-4 py-3 font-body text-sm text-brand-red-dark">
              {error}
            </p>
          )}

          {/* Role toggle */}
          <div className="flex rounded-lg bg-[#e6eeff] p-1">
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`flex-1 rounded-md px-4 py-2 font-body text-xs font-medium tracking-[0.6px] transition-colors ${
                isDriver ? 'bg-white text-brand-red shadow-sm' : 'text-brand-text'
              }`}
            >
              Offer Rides (Driver)
            </button>
            <button
              type="button"
              onClick={() => setRole('passenger')}
              className={`flex-1 rounded-md px-4 py-2 font-body text-xs font-medium tracking-[0.6px] transition-colors ${
                !isDriver ? 'bg-white text-brand-red shadow-sm' : 'text-brand-text'
              }`}
            >
              Find Rides (Passenger)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              icon={iconUser}
              placeholder="John Doe"
              name="fullName"
              value={form.fullName}
              onChange={update('fullName')}
              required
            />
            <FormField
              label="Student ID"
              icon={iconIdCard}
              placeholder="011 222 333"
              name="studentId"
              value={form.studentId}
              onChange={update('studentId')}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="px-1 font-body text-xs font-medium uppercase tracking-[0.6px] text-brand-text">
                Gender
              </span>
              <span className="relative flex items-center">
                <img src={iconUser} alt="" className="pointer-events-none absolute left-[12px] h-4 w-4 opacity-70" />
                <select
                  className="w-full appearance-none rounded-lg border border-[#e4beb9] bg-white py-[13px] pl-[41px] pr-9 text-sm text-brand-ink focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  value={form.gender}
                  onChange={update('gender')}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <img
                  src={iconChevronDown}
                  alt=""
                  className="pointer-events-none absolute right-[12px] h-3 w-3 opacity-70"
                />
              </span>
            </label>

            <FormField
              label="Phone Number"
              icon={iconPhone}
              placeholder="01712345678"
              name="phone"
              value={form.phone}
              onChange={update('phone')}
            />
          </div>

          <FormField
            label="UIU Email Address"
            icon={iconMail}
            type="email"
            placeholder="jdoe123@bscse.uiu.ac.bd"
            name="email"
            value={form.email}
            onChange={update('email')}
          />

          {isDriver && (
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="px-1 font-body text-xs font-medium uppercase tracking-[0.6px] text-brand-text">
                  Vehicle Type
                </span>
                <span className="relative flex items-center">
                  <img src={iconCar} alt="" className="pointer-events-none absolute left-[12px] h-4 w-4 opacity-70" />
                  <select
                    className="w-full appearance-none rounded-lg border border-[#e4beb9] bg-white py-[13px] pl-[41px] pr-9 text-sm text-brand-ink focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    value={form.vehicleType}
                    onChange={update('vehicleType')}
                  >
                    <option>Car</option>
                    <option>Motorcycle</option>
                    <option>CNG</option>
                  </select>
                  <img
                    src={iconChevronDown}
                    alt=""
                    className="pointer-events-none absolute right-[12px] h-3 w-3 opacity-70"
                  />
                </span>
              </label>
              <FormField
                label="Vehicle Registration Number"
                icon={iconPlate}
                placeholder="e.g., DHA-METRO-GA-11-2233"
                name="vehicleReg"
                value={form.vehicleReg}
                onChange={update('vehicleReg')}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Password"
              icon={iconLock}
              type="password"
              placeholder="••••••••"
              toggleablePassword
              name="password"
              value={form.password}
              onChange={update('password')}
              required
            />
            <FormField
              label="Confirm Password"
              icon={iconLockConfirm}
              type="password"
              placeholder="••••••••"
              toggleablePassword
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              required
            />
          </div>

          <label className="flex items-start gap-3 py-2 font-body text-sm text-brand-text">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 size-5 rounded border-[#e4beb9]"
            />
            <span>
              I agree to the{' '}
              <a href="#" className="font-semibold text-brand-red-dark">
                Safety Guidelines
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-brand-red-dark">
                Terms of Service
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-red py-4 font-display text-xl font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Register Account'}
          </button>

          <p className="pt-2 text-center font-body text-sm text-brand-text">
            Already have an account?{' '}
            <Link to="/login" className="font-display font-bold text-brand-red">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
