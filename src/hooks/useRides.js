import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

/**
 * Fetches rides from GET /api/rides.
 *
 * Pass filters to have them forwarded as query params. `refetch` re-runs the
 * request — useful after the Search Rides button or after joining a ride.
 */
export function useRides(filters = {}) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stringified so the effect only re-runs when filter values actually change.
  const filterKey = JSON.stringify(filters);

  const fetchRides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRides(JSON.parse(filterKey));
      setRides(data.rides);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterKey]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getRides(JSON.parse(filterKey));
        if (!cancelled) setRides(data.rides);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filterKey]);

  return { rides, loading, error, refetch: fetchRides };
}
