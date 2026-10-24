import { useCallback, useEffect, useState } from 'react';
import AppNavbar from '../components/AppNavbar';
import TripSummaryBento from '../components/TripSummaryBento';
import TripCard from '../components/TripCard';
import { api } from '../api/client';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function MyTrips() {
  const [tab, setTab] = useState('upcoming');
  const [trips, setTrips] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tripData, summaryData] = await Promise.all([
        api.getTrips(tab),
        api.getTripSummary(),
      ]);
      setTrips(tripData.trips);
      setSummary(summaryData.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleCancel = async (tripId) => {
    try {
      await api.cancelTrip(tripId);
      loadTrips();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <AppNavbar />

      <main className="mx-auto flex flex-col gap-6 sm:gap-8 max-w-[1700px] px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12 pb-24 lg:pb-12">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-ink">My Trips</h1>
          <p className="mt-1 font-body text-xs sm:text-base text-brand-text">
            Track your ride history and upcoming journeys.
          </p>
        </div>

        <TripSummaryBento summary={summary} />

        <div className="flex w-full sm:w-fit gap-1 sm:gap-2 rounded-xl border border-brand-panel bg-white p-1 sm:p-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 sm:flex-initial rounded-lg px-3 sm:px-6 py-2 font-body text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                tab === t.key ? 'bg-brand-red text-white shadow-sm' : 'text-brand-text hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {loading && (
            <div className="rounded-xl border border-brand-panel bg-white py-16 text-center font-body text-brand-text">
              Loading trips…
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-[#e4beb9] bg-[#fde2e1] p-6 font-body text-sm text-brand-red-dark">
              {error}
            </div>
          )}

          {!loading && !error && trips.length === 0 && (
            <div className="rounded-xl border border-dashed border-brand-panel bg-white py-16 text-center">
              <p className="font-body text-base text-brand-text">No {tab} trips yet.</p>
            </div>
          )}

          {!loading &&
            !error &&
            trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onCancel={() => handleCancel(trip.id)} />
            ))}
        </div>
      </main>
    </div>
  );
}
