import { useState } from 'react';
import AppNavbar from '../components/AppNavbar';
import RideCard from '../components/RideCard';
import { useRides } from '../hooks/useRides';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { iconPinRed, iconPinOutline, iconChevronDown } from '../assets/find-ride-images';

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Anytime'];
const SEAT_OPTIONS = ['1', '2', '3', '4+'];
const GENDER_OPTIONS = ['No Preference', 'Male Only', 'Female Only', 'Mixed Gender'];

const withAvatar = (ride) => {
  const nameParts = (ride.driver?.name || 'User').split(' ');
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[1][0]}`
    : nameParts[0].slice(0, 2);
  
  // Pick a background color based on name length or first char
  const colors = ['b7131a', '27313f', '1d4ed8', '047857', '9333ea', 'ea580c'];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return {
    ...ride,
    driver: {
      ...ride.driver,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=200&rounded=true&bold=true`
    },
  };
};

export default function FindRide() {
  const [time, setTime] = useState('Anytime');
  const [seats, setSeats] = useState('1');
  const [gender, setGender] = useState('No Preference');

  // Committed filters — updated only when "Search Rides" is pressed, so typing
  // in the inputs does not fire a request on every keystroke.
  const [pickup, setPickup] = useState('UIU Main Campus');
  const [destination, setDestination] = useState('');
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('Earliest');
  const [showSort, setShowSort] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { user } = useAuth();
  const { rides, loading, error, refetch } = useRides(filters);

  const handleSearch = () => {
    setFilters({
      from: pickup,
      to: destination,
      minSeats: seats.replace('+', ''),
      ...(time !== 'Anytime' && { time }),
      ...(gender !== 'No Preference' && { genderPreference: gender }),
      ...(sortOption !== 'Earliest' && { sort: sortOption.toLowerCase() }),
    });
    setShowMobileFilters(false);
  };

  const handleClearAll = () => {
    setPickup('UIU Main Campus');
    setDestination('');
    setTime('Anytime');
    setSeats('1');
    setGender('No Preference');
    setSortOption('Earliest');
    setFilters({});
    setShowMobileFilters(false);
  };

  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRideForJoin, setSelectedRideForJoin] = useState(null);
  const [joinSeats, setJoinSeats] = useState(1);
  const [isJoining, setIsJoining] = useState(false);

  const handleConfirmJoin = async () => {
    if (!selectedRideForJoin) return;
    setIsJoining(true);
    try {
      await api.joinRide(selectedRideForJoin.id, joinSeats);
      setSuccessMessage('Ride booked successfully! Check My Trips.');
      setTimeout(() => setSuccessMessage(''), 4000);
      refetch();
      setSelectedRideForJoin(null);
      setJoinSeats(1);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to join ride');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg relative">
      <AppNavbar />

      {successMessage && (
        <div className="fixed top-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-green-500 px-6 py-3 font-body text-sm font-semibold text-white shadow-lg transition-all animate-bounce">
          {successMessage}
        </div>
      )}

      <main className="mx-auto flex flex-col lg:flex-row max-w-[1700px] items-start gap-6 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12 pb-24 lg:pb-12">
        {/* Mobile Filter Toggle Button */}
        <div className="flex w-full items-center justify-between rounded-xl border border-brand-panel bg-white p-3.5 shadow-sm lg:hidden">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 font-display text-sm font-semibold text-brand-ink"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </span>
            <span>{showMobileFilters ? 'Hide Filters' : 'Filter Rides'}</span>
          </button>

          <span className="text-xs font-medium text-brand-text">
            {rides.length} rides available
          </span>
        </div>

        {/* Sidebar filters */}
        <aside
          className={`w-full lg:w-80 shrink-0 rounded-2xl border border-brand-panel bg-white p-5 sm:p-6 shadow-sm ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brand-ink">Filters</h2>
            <button
              type="button"
              onClick={handleClearAll}
              className="font-body text-xs sm:text-sm font-medium text-brand-red-dark hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium uppercase tracking-wider text-brand-text">Pickup Point</label>
              <div className="relative">
                <img src={iconPinRed} alt="" className="pointer-events-none absolute left-3 top-1/2 h-4 w-3.5 -translate-y-1/2" />
                <input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full rounded-xl bg-[#e6eeff] py-2.5 sm:py-3 pl-10 pr-4 font-body text-base sm:text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium uppercase tracking-wider text-brand-text">Destination</label>
              <div className="relative">
                <img src={iconPinOutline} alt="" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Dhanmondi 27"
                  className="w-full rounded-xl bg-[#e6eeff] py-2.5 sm:py-3 pl-10 pr-4 font-body text-base sm:text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium uppercase tracking-wider text-brand-text">Departure Time</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setTime(slot);
                      setFilters(prev => ({ ...prev, time: slot !== 'Anytime' ? slot : undefined }));
                    }}
                    className={`rounded-lg border py-2 font-body text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                      time === slot
                        ? 'border-brand-red bg-brand-red text-white shadow-sm'
                        : 'border-[#e4beb9] text-brand-ink hover:bg-gray-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium uppercase tracking-wider text-brand-text">Gender Preference</label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGender(val);
                    setFilters(prev => ({ ...prev, genderPreference: val !== 'No Preference' ? val : undefined }));
                  }}
                  className="w-full appearance-none rounded-xl bg-[#e6eeff] px-4 py-2.5 sm:py-3 font-body text-base sm:text-sm text-brand-ink focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <img src={iconChevronDown} alt="" className="pointer-events-none absolute right-4 top-1/2 h-3 w-4 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium uppercase tracking-wider text-brand-text">Min. Available Seats</label>
              <div className="flex gap-2">
                {SEAT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSeats(opt);
                      setFilters(prev => ({ ...prev, minSeats: opt.replace('+', '') }));
                    }}
                    className={`flex-1 rounded-lg py-2 font-body text-sm sm:text-base font-semibold transition-all active:scale-95 ${
                      seats === opt ? 'bg-brand-red text-white shadow-sm' : 'bg-[#e6eeff] text-brand-ink hover:bg-[#dee9fc]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="mt-6 w-full rounded-xl bg-brand-red py-3 sm:py-3.5 font-display text-sm sm:text-base font-semibold text-white shadow-md shadow-brand-red/20 transition-all hover:bg-brand-red-dark active:scale-95"
          >
            Search Rides
          </button>
        </aside>

        {/* Results */}
        <section className="flex flex-1 flex-col gap-4 sm:gap-6 w-full">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-brand-ink">
              Available Rides{' '}
              <span className="font-body text-xs sm:text-sm font-normal text-brand-text">
                ({loading ? 'searching…' : `${rides.length} found`})
              </span>
            </h1>
            <div className="relative">
              <button 
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#dee9fc] px-3 py-1.5 sm:px-4 sm:py-2 font-body text-xs sm:text-sm text-brand-text transition-colors hover:bg-[#cddbf5]"
              >
                <span>Sort:</span> <span className="font-semibold text-brand-ink">{sortOption}</span>
                <img src={iconChevronDown} alt="" className={`h-1.5 w-2 transition-transform ${showSort ? 'rotate-180' : ''}`} />
              </button>
              
              {showSort && (
                <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-brand-panel bg-white shadow-lg z-10">
                  {['Earliest', 'Price', 'Seats'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortOption(opt);
                        setShowSort(false);
                        // trigger search automatically on sort change
                        setFilters(prev => ({ ...prev, sort: opt.toLowerCase() }));
                      }}
                      className="block w-full px-4 py-3 text-left font-body text-sm text-brand-ink hover:bg-[#f5f5f5]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {loading && (
              <div className="rounded-xl border border-brand-panel bg-white py-16 text-center font-body text-brand-text">
                Loading rides…
              </div>
            )}

            {error && !loading && (
              <div className="rounded-xl border border-[#e4beb9] bg-[#fde2e1] p-6 font-body text-sm text-brand-red-dark">
                Could not load rides: {error}
              </div>
            )}

            {!loading && !error && rides.length === 0 && (
              <div className="rounded-xl border border-dashed border-brand-panel bg-white py-16 text-center font-body text-brand-text">
                No rides match your filters yet.
              </div>
            )}

            {!loading &&
              !error &&
              rides.map((ride, index) => (
                <RideCard
                  key={ride.id}
                  ride={withAvatar(ride, index)}
                  onJoin={() => {
                    const reqGender = ride.genderPreference;
                    if (reqGender === 'Male Only' && user?.gender === 'Female') {
                      alert('This ride is restricted to Male passengers only.');
                      return;
                    }
                    if (reqGender === 'Female Only' && user?.gender === 'Male') {
                      alert('This ride is restricted to Female passengers only.');
                      return;
                    }
                    setSelectedRideForJoin(withAvatar(ride, index));
                    setJoinSeats(1);
                  }}
                />
              ))}
          </div>
        </section>
      </main>

      {/* Join Ride Modal */}
      {selectedRideForJoin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-ink">Confirm Booking</h3>
            <p className="mt-1.5 font-body text-xs sm:text-sm text-brand-text">
              You are about to join a ride with <span className="font-semibold text-brand-ink">{selectedRideForJoin.driver.name}</span>.
            </p>
            
            <div className="mt-4 rounded-xl border border-brand-panel bg-[#fafafa] p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-body text-sm text-brand-text">Route</span>
                <span className="font-body text-sm font-semibold text-brand-ink">
                  {selectedRideForJoin.from.name} &rarr; {selectedRideForJoin.to.name}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-body text-sm text-brand-text">Time</span>
                <span className="font-body text-sm font-semibold text-brand-ink">
                  {selectedRideForJoin.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-brand-text">Price per seat</span>
                <span className="font-body text-sm font-semibold text-brand-red">
                  ৳{selectedRideForJoin.price}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <label className="font-body text-sm font-medium text-brand-ink">
                How many seats do you need? (Max: {selectedRideForJoin.seatsAvailable})
              </label>
              <input 
                type="number"
                min="1"
                max={selectedRideForJoin.seatsAvailable}
                value={joinSeats}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  if (val > selectedRideForJoin.seatsAvailable) val = selectedRideForJoin.seatsAvailable;
                  setJoinSeats(val);
                }}
                className="w-full rounded-lg border border-brand-panel bg-white px-4 py-3 font-body text-sm text-brand-ink focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
              />
            </div>

            <div className="mt-4 flex justify-between items-center border-t border-brand-panel pt-4">
              <span className="font-body text-base text-brand-ink">Total Amount:</span>
              <span className="font-display text-2xl font-bold text-brand-red">
                ৳{selectedRideForJoin.price * joinSeats}
              </span>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedRideForJoin(null)}
                className="flex-1 rounded-lg border border-brand-panel bg-white py-3 font-body text-base font-semibold text-brand-ink transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmJoin}
                disabled={isJoining}
                className="flex-1 rounded-lg bg-brand-red py-3 font-body text-base font-semibold text-white shadow-sm disabled:opacity-60"
              >
                {isJoining ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
