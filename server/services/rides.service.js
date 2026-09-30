import { store } from '../data/index.js';
import { ApiError } from '../middleware/errorHandler.js';

const REQUIRED_FIELDS = ['from', 'to', 'departureDate', 'time', 'price', 'totalSeats'];

const normalizePlace = (value) =>
  typeof value === 'string' ? { name: value, detail: '' } : { name: '', detail: '', ...value };

export const ridesService = {
  async listRides(filters) {
    const rides = await store.findRides(filters);

    // Sort earliest first, matching the "Sort by: Earliest" control in the UI.
    return [...rides].sort((a, b) => {
      const byDate = String(a.departureDate).localeCompare(String(b.departureDate));
      return byDate !== 0 ? byDate : String(a.time).localeCompare(String(b.time));
    });
  },

  async getRide(id) {
    const ride = await store.findRideById(id);
    if (!ride) throw new ApiError(404, 'Ride not found');
    return ride;
  },

  async createRide(payload) {
    const missing = REQUIRED_FIELDS.filter((field) => payload[field] === undefined);
    if (missing.length) {
      throw new ApiError(400, `Missing required field(s): ${missing.join(', ')}`);
    }

    const totalSeats = Number(payload.totalSeats);
    const price = Number(payload.price);

    if (!Number.isFinite(totalSeats) || totalSeats < 1) {
      throw new ApiError(400, 'totalSeats must be a positive number');
    }
    if (!Number.isFinite(price) || price < 0) {
      throw new ApiError(400, 'price must be a non-negative number');
    }

    return store.createRide({
      driverId: payload.driverId ?? null,
      driver: payload.driver ?? { name: 'Unknown', tag: 'UIU Student', rating: null },
      from: normalizePlace(payload.from),
      to: normalizePlace(payload.to),
      departureDate: payload.departureDate,
      time: payload.time,
      vehicle: payload.vehicle ?? '',
      genderPreference: payload.genderPreference ?? 'Mixed Gender',
      acOn: Boolean(payload.acOn),
      price,
      totalSeats,
      seatsAvailable: payload.seatsAvailable ?? totalSeats,
    });
  },

  /**
   * Claims a seat via the store's atomic decrement, so two simultaneous joins
   * cannot oversell the last seat. A null result means no seat was available.
   * If a logged-in user is provided, an 'upcoming' trip record is also created
   * so the ride appears in their My Trips page immediately.
   */
  async joinRide(id, user) {
    const ride = await this.getRide(id); // 404 if the ride does not exist at all

    const updated = await store.decrementSeat(id);
    if (!updated) throw new ApiError(409, 'This ride is already full');

    // Create a trip record so the passenger can see it in My Trips.
    if (user?.id) {
      const formatDate = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      };

      await store.createTrip({
        userId: user.id,
        status: 'upcoming',
        date: formatDate(ride.departureDate),
        time: ride.time,
        from: ride.from?.name ?? '',
        to: ride.to?.name ?? '',
        role: 'passenger',
        withPerson: ride.driver?.name ?? 'Driver',
        price: `৳${ride.price}`,
        rideId: id,
      });
    }

    return updated;
  },
};
