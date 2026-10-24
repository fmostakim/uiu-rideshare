import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  mapRoutePreview,
  iconCar,
  iconBike,
  iconScooter,
  iconPickup,
  iconDestination,
  iconDate,
  iconTime,
  iconSeats,
  iconPrice,
  iconPublish,
  iconTipSafety,
  iconTipGreen,
  iconListVerified,
  iconListCost,
  iconListNetwork,
} from '../assets/offer-ride-images';

const VEHICLES = [
  { key: 'Car', icon: iconCar, className: 'h-6 w-[27px]' },
  { key: 'Bike', icon: iconBike, className: 'h-[21px] w-9' },
  { key: 'Scooter', icon: iconScooter, className: 'h-[33px] w-[30px]' },
];

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6];

const BENEFITS = [
  { icon: iconListVerified, text: 'Only verified UIU students can join', className: 'h-5 w-4' },
  { icon: iconListCost, text: 'Cut your commuting costs by up to 75%', className: 'h-[18px] w-[19px]' },
  { icon: iconListNetwork, text: 'Build your campus network while traveling', className: 'h-[23px] w-6' },
];

/** Converts "14:30" from <input type="time"> into the "02:30 PM" the cards display. */
const formatTime = (value) => {
  if (!value) return '';
  const [hours, minutes] = value.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

const FieldLabel = ({ children }) => (
  <span className="font-body text-xs font-medium tracking-[0.6px] text-brand-text">{children}</span>
);

export default function OfferRide() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState('Car');
  const [form, setForm] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    seats: 1,
    price: '',
    genderPreference: 'Mixed Gender',
    notes: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.pickup || !form.destination || !form.date || !form.time || form.price === '') {
      setError('Please fill in the route, date, time and price.');
      return;
    }

    setSubmitting(true);
    try {
      await api.createRide({
        driverId: user?.id ?? null,
        driver: {
          name: user?.fullName ?? 'UIU Student',
          tag: user?.role === 'driver' ? 'Driver' : 'UIU Student',
          rating: user?.rating ? String(user.rating) : null,
        },
        from: { name: form.pickup, detail: '' },
        to: { name: form.destination, detail: '' },
        departureDate: form.date,
        time: formatTime(form.time),
        vehicle,
        genderPreference: form.genderPreference,
        acOn: vehicle === 'Car',
        price: Number(form.price),
        totalSeats: Number(form.seats),
        seatsAvailable: Number(form.seats),
        notes: form.notes,
      });
      navigate('/find-ride', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <AppNavbar />

      <main className="mx-auto grid max-w-[1700px] grid-cols-1 gap-6 sm:gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12 pb-24 lg:pb-12 lg:grid-cols-12">
        {/* Form side */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:col-span-7">
          <div>
            <h1 className="font-display text-2xl sm:text-[32px] font-bold leading-tight sm:leading-10 text-brand-ink">
              Offer a Ride
            </h1>
            <p className="mt-1 font-body text-xs sm:text-base text-brand-text">
              Share your journey and help fellow students commute safely.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 sm:gap-6 rounded-2xl border border-brand-panel bg-white p-4 sm:p-8 shadow-sm"
          >
            {error && (
              <p className="rounded-lg bg-[#fde2e1] px-4 py-2.5 font-body text-sm text-brand-red-dark">
                {error}
              </p>
            )}

            {/* Vehicle type */}
            <div className="flex flex-col gap-3">
              <span className="font-display text-lg sm:text-xl font-bold text-brand-ink">Vehicle Type</span>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {VEHICLES.map((option) => {
                  const active = vehicle === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setVehicle(option.key)}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 border-brand-panel p-3 sm:py-4 transition-all active:scale-95 ${
                        active ? 'bg-[#ffdad6] border-brand-red' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <img src={option.icon} alt="" className={option.className} />
                      <span
                        className={`pt-1 font-body text-xs font-semibold tracking-wide ${
                          active ? 'text-brand-red-dark' : 'text-brand-text'
                        }`}
                      >
                        {option.key}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Route */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <label className="flex flex-1 flex-col gap-1">
                <FieldLabel>Pickup Point</FieldLabel>
                <span className="flex items-center gap-2 rounded-xl border border-[#e4beb9] bg-white px-3.5 py-2.5">
                  <img src={iconPickup} alt="" className="h-5 w-6 shrink-0" />
                  <input
                    value={form.pickup}
                    onChange={update('pickup')}
                    placeholder="Where are you starting from?"
                    className="w-full bg-transparent py-1 font-body text-base sm:text-sm text-brand-ink placeholder:text-gray-400 focus:outline-none"
                  />
                </span>
              </label>

              <label className="flex flex-1 flex-col gap-1">
                <FieldLabel>Destination</FieldLabel>
                <span className="flex items-center gap-2 rounded-xl border border-[#e4beb9] bg-white px-3.5 py-2.5">
                  <img src={iconDestination} alt="" className="h-5 w-5 shrink-0" />
                  <input
                    value={form.destination}
                    onChange={update('destination')}
                    placeholder="Where are you going?"
                    className="w-full bg-transparent py-1 font-body text-base sm:text-sm text-brand-ink placeholder:text-gray-400 focus:outline-none"
                  />
                </span>
              </label>
            </div>

            {/* Date and time */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <label className="flex flex-1 flex-col gap-1">
                <FieldLabel>Departure Date</FieldLabel>
                <span className="flex items-center gap-2 rounded-xl border border-[#e4beb9] bg-white px-3.5 py-2.5">
                  <img src={iconDate} alt="" className="h-5 w-5 shrink-0" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={update('date')}
                    className="w-full bg-transparent py-1 font-body text-base sm:text-sm text-brand-ink focus:outline-none"
                  />
                </span>
              </label>

              <label className="flex flex-1 flex-col gap-1">
                <FieldLabel>Departure Time</FieldLabel>
                <span className="flex items-center gap-2 rounded-xl border border-[#e4beb9] bg-white px-3.5 py-2.5">
                  <img src={iconTime} alt="" className="h-5 w-5 shrink-0" />
                  <input
                    type="time"
                    value={form.time}
                    onChange={update('time')}
                    className="w-full bg-transparent py-1 font-body text-base sm:text-sm text-brand-ink focus:outline-none"
                  />
                </span>
              </label>
            </div>

            {/* Seats and price */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <label className="flex flex-1 flex-col gap-1">
                <FieldLabel>Available Seats</FieldLabel>
                <span className="flex items-center gap-2 rounded-xl border border-[#e4beb9] bg-white px-3.5 py-2.5">
                  <img src={iconSeats} alt="" className="h-4 w-5 shrink-0" />
                  <select
                    value={form.seats}
                    onChange={update('seats')}
                    className="w-full bg-transparent py-1 font-body text-base sm:text-sm text-brand-ink focus:outline-none"
                  >
                    {SEAT_OPTIONS.map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? 'Seat' : 'Seats'}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label className="flex flex-1 flex-col gap-1">
                <FieldLabel>Price per Seat (৳)</FieldLabel>
                <span className="flex items-center gap-2 rounded-xl border border-[#e4beb9] bg-white px-3.5 py-2.5">
                  <img src={iconPrice} alt="" className="h-4 w-5 shrink-0" />
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={update('price')}
                    placeholder="Enter amount"
                    className="w-full bg-transparent py-1 font-body text-base sm:text-sm text-brand-ink placeholder:text-gray-400 focus:outline-none"
                  />
                </span>
              </label>
            </div>

            {/* Gender Preference */}
            <label className="flex flex-col gap-1">
              <FieldLabel>Gender Preference</FieldLabel>
              <select
                value={form.genderPreference}
                onChange={update('genderPreference')}
                className="w-full rounded-xl border border-[#e4beb9] bg-white px-4 py-3 font-body text-base sm:text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-red"
              >
                <option value="Mixed Gender">Mixed Gender (Anyone can join)</option>
                <option value="Male Only">Male Only</option>
                <option value="Female Only">Female Only</option>
              </select>
            </label>

            {/* Notes */}
            <label className="flex flex-col gap-1">
              <FieldLabel>Ride Notes (Optional)</FieldLabel>
              <textarea
                value={form.notes}
                onChange={update('notes')}
                rows={3}
                placeholder="Any specific requirements or student guidelines..."
                className="w-full resize-none rounded-xl border border-[#e4beb9] bg-white px-4 py-2.5 font-body text-base sm:text-sm text-brand-ink placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3.5 sm:py-4 font-display text-base sm:text-xl font-semibold text-white shadow-md shadow-brand-red/20 transition-all hover:bg-brand-red-dark active:scale-95 disabled:opacity-60"
            >
              <img src={iconPublish} alt="" className="size-4" />
              {submitting ? 'Publishing…' : 'Publish Ride'}
            </button>
          </form>
        </div>

        {/* Info side */}
        <aside className="flex flex-col gap-6 lg:col-span-5">
          <div className="relative h-48 sm:h-64 overflow-hidden rounded-2xl border border-brand-panel shadow-sm">
            <img src={mapRoutePreview} alt="Route map" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 sm:p-6">
              <div>
                <p className="font-display text-lg sm:text-xl font-bold text-white">Route Visualizer</p>
                <p className="font-body text-xs sm:text-sm text-white/90">
                  Check your pickup and drop-off points
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col gap-1 rounded-2xl border border-[#dee9fc] bg-[#eff4ff] p-4 sm:p-5">
              <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-[rgba(183,19,26,0.1)]">
                <img src={iconTipSafety} alt="" className="h-5 w-4" />
              </span>
              <h3 className="pt-2 font-display text-lg sm:text-xl font-bold text-brand-ink">Safety First</h3>
              <p className="font-body text-xs sm:text-sm leading-relaxed text-brand-text">
                Always verify IDs before starting your shared journey.
              </p>
            </div>

            <div className="flex flex-col gap-1 rounded-2xl border border-[#dee9fc] bg-[#eff4ff] p-4 sm:p-5">
              <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-[rgba(117,87,0,0.1)]">
                <img src={iconTipGreen} alt="" className="size-4 sm:size-[17px]" />
              </span>
              <h3 className="pt-2 font-display text-lg sm:text-xl font-bold text-brand-ink">Go Green</h3>
              <p className="font-body text-xs sm:text-sm leading-relaxed text-brand-text">
                Sharing one ride saves approximately 4kg of CO2.
              </p>
            </div>

            <div className="sm:col-span-2 rounded-2xl bg-[#27313f] p-5 sm:p-8">
              <h3 className="font-display text-2xl sm:text-[32px] font-bold leading-tight sm:leading-10 text-[#eaf1ff]">
                Why publish here?
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {BENEFITS.map((benefit) => (
                  <li key={benefit.text} className="flex items-center gap-2.5">
                    <img src={benefit.icon} alt="" className={`${benefit.className} shrink-0`} />
                    <span className="font-body text-xs sm:text-sm text-[#eaf1ff]">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
