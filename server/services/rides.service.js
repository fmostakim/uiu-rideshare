import { store } from '../data/index.js';
import { ApiError } from '../middleware/errorHandler.js';

const REQUIRED_FIELDS = ['from', 'to', 'departureDate', 'time', 'price', 'totalSeats'];

const normalizePlace = (value) =>
  typeof value === 'string' ? { name: value, detail: '' } : { name: '', detail: '', ...value };

export const ridesService = {
  async listRides(filters) {
    let rides = await store.findRides(filters);

    const parseTime = (t) => {
      if (!t) return 0;
      const match = String(t).match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return 0;
      let [_, h, m, p] = match;
      h = Number(h);
      if (p.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (p.toUpperCase() === 'AM' && h === 12) h = 0;
      return h * 60 + Number(m);
    };

    if (filters.time && filters.time !== 'Anytime') {
      rides = rides.filter((ride) => {
        const hours = parseTime(ride.time) / 60;
        if (filters.time === 'Morning') return hours < 12;
        if (filters.time === 'Afternoon') return hours >= 12 && hours < 17;
        if (filters.time === 'Evening') return hours >= 17;
        return true;
      });
    }

    return rides.sort((a, b) => {
      if (filters.sort === 'price') return a.price - b.price;
      if (filters.sort === 'seats') return b.seatsAvailable - a.seatsAvailable;
      
      // Default: Earliest
      const byDate = String(a.departureDate).localeCompare(String(b.departureDate));
      if (byDate !== 0) return byDate;
      return parseTime(a.time) - parseTime(b.time);
    });
  },

  async getRide(id) {
    const ride = await store.findRideById(id);
    if (!ride) throw new ApiError(404, 'Ride not found');
    return ride;
  },

  async createRide(payload, user) {
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
      driverId: user?.id ?? payload.driverId ?? null,
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

    if (user?.id) {
      if (ride.driverId === user.id) {
        throw new ApiError(403, 'You cannot join your own ride');
      }

      // Check if user already joined this ride
      const existingTrips = await store.findTripsByUser(user.id, 'upcoming');
      if (existingTrips.some(t => t.rideId === id)) {
        throw new ApiError(409, 'You have already joined this ride');
      }
    }

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
