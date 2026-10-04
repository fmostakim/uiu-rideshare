import { store } from '../data/index.js';
import { ApiError } from '../middleware/errorHandler.js';

const VALID_STATUSES = ['upcoming', 'completed', 'cancelled'];

export const tripsService = {
  async listForUser(userId, status) {
    if (status && !VALID_STATUSES.includes(status)) {
      throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    return store.findTripsByUser(userId, status);
  },

  async summaryForUser(userId) {
    const trips = await store.findTripsByUser(userId);
    const completed = trips.filter((trip) => trip.status === 'completed');

    const totalSpent = completed.reduce((sum, trip) => {
      const amount = Number(String(trip.price).replace(/[^\d.]/g, ''));
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return {
      totalTrips: trips.length,
      completedTrips: completed.length,
      // Rough estimate: ~0.12 kg CO2 saved per taka of shared fare.
      co2SavedKg: Math.round(completed.length * 1.5 * 10) / 10,
      moneySaved: totalSpent,
    };
  },

  async cancel(userId, tripId) {
    const trips = await store.findTripsByUser(userId);
    const trip = trips.find((t) => t.id === tripId);

    if (!trip) throw new ApiError(404, 'Trip not found');
    if (trip.status !== 'upcoming') {
      throw new ApiError(409, 'Only upcoming trips can be cancelled');
    }

    if (trip.rideId) {
      const seatsToRestore = trip.seatsBooked || 1;
      await store.incrementSeat(trip.rideId, seatsToRestore);
    }

    return store.updateTrip(tripId, {
      status: 'cancelled',
      note: 'Cancelled by you',
    });
  },
};
