/**
 * In-memory repository.
 *
 * Implements exactly the same interface as mongo.store.js so services never
 * know which one is active. Every method is async for the same reason.
 *
 * NOTE: on Vercel, serverless functions are stateless and cold-start freely, so
 * writes here will not reliably persist between requests. Set MONGODB_URI to
 * switch to real persistence.
 */

let rideIdCounter = 3;
let tripIdCounter = 6;
let messageIdCounter = 1;
const messages = [];

const users = [
  {
    id: 'u1',
    fullName: 'Rahat Saleh',
    studentId: '0112330001',
    gender: 'Male',
    email: 'rsaleh1@bscse.uiu.ac.bd',
    phone: '01712345678',
    role: 'driver',
    rating: 4.9,
    password: 'password123',
  },
  {
    id: 'u2',
    fullName: 'Nadia Karim',
    studentId: '0112330002',
    gender: 'Female',
    email: 'nkarim2@bscse.uiu.ac.bd',
    phone: '01798765432',
    role: 'passenger',
    rating: 4.8,
    password: 'password123',
  },
];

const rides = [
  {
    id: 'r1',
    driverId: 'u1',
    driver: { name: 'Rahat S.', tag: 'CS Senior', rating: '4.9' },
    from: { name: 'UIU Main Gate', detail: 'United City, Madani Avenue' },
    to: { name: 'Banani 11', detail: 'Road 11, Block D' },
    departureDate: '2026-09-05',
    time: '09:30 AM',
    vehicle: 'Toyota Corolla (Black)',
    genderPreference: 'Mixed Gender',
    acOn: true,
    price: 50,
    seatsAvailable: 2,
    totalSeats: 4,
    createdAt: new Date('2026-09-01T08:00:00Z').toISOString(),
  },
  {
    id: 'r2',
    driverId: 'u1',
    driver: { name: 'Fahim M.', tag: 'EEE Alumni', rating: '4.7' },
    from: { name: 'UIU Main Campus', detail: 'Parking Zone A' },
    to: { name: 'Uttara House Building', detail: 'Azampur Bus Stand' },
    departureDate: '2026-09-06',
    time: '05:45 PM',
    vehicle: 'Honda Civic (White)',
    genderPreference: 'Mixed Gender',
    acOn: false,
    price: 80,
    seatsAvailable: 3,
    totalSeats: 4,
    createdAt: new Date('2026-09-01T09:30:00Z').toISOString(),
  },
];

const trips = [
  {
    id: 't1',
    userId: 'u2',
    status: 'upcoming',
    date: 'Sep 5, 2026',
    time: '09:30 AM',
    from: 'UIU Main Gate',
    to: 'Banani 11',
    role: 'passenger',
    withPerson: 'Rahat S.',
    price: '৳50',
  },
  {
    id: 't2',
    userId: 'u2',
    status: 'upcoming',
    date: 'Sep 6, 2026',
    time: '05:45 PM',
    from: 'UIU Main Campus',
    to: 'Uttara House Building',
    role: 'passenger',
    withPerson: 'Fahim M.',
    price: '৳80',
  },
  {
    id: 't3',
    userId: 'u2',
    status: 'completed',
    date: 'Aug 28, 2026',
    time: '08:15 AM',
    from: 'Badda',
    to: 'UIU Main Gate',
    role: 'driver',
    withPerson: '3 passengers',
    price: '৳150',
  },
  {
    id: 't4',
    userId: 'u2',
    status: 'completed',
    date: 'Aug 20, 2026',
    time: '06:00 PM',
    from: 'UIU Main Campus',
    to: 'Malibagh',
    role: 'passenger',
    withPerson: 'Tanvir H.',
    price: '৳60',
  },
  {
    id: 't5',
    userId: 'u2',
    status: 'cancelled',
    date: 'Aug 14, 2026',
    time: '10:00 AM',
    from: 'Bashundhara',
    to: 'UIU Main Gate',
    role: 'passenger',
    withPerson: 'Nadia K.',
    price: '৳45',
    note: 'Cancelled by driver — fully refunded',
  },
];

const escapeRegex = (value) => String(value).toLowerCase();

const matchesFilters = (ride, filters = {}) => {
  const { from, to, minSeats, genderPreference, maxPrice } = filters;

  if (from && !ride.from.name.toLowerCase().includes(escapeRegex(from))) return false;
  if (to && !ride.to.name.toLowerCase().includes(escapeRegex(to))) return false;
  if (minSeats && ride.seatsAvailable < Number(minSeats)) return false;
  if (maxPrice && ride.price > Number(maxPrice)) return false;
  if (
    genderPreference &&
    genderPreference !== 'No Preference' &&
    ride.genderPreference !== genderPreference
  ) {
    return false;
  }
  return true;
};

export const memoryStore = {
  // ---- rides ----
  async findRides(filters = {}) {
    return rides
      .filter((ride) => matchesFilters(ride, filters))
      .sort(
        (a, b) =>
          String(a.departureDate).localeCompare(String(b.departureDate)) ||
          String(a.time).localeCompare(String(b.time))
      );
  },

  async findRideById(id) {
    return rides.find((ride) => ride.id === id) ?? null;
  },

  async createRide(payload) {
    const ride = { id: `r${rideIdCounter++}`, ...payload, createdAt: new Date().toISOString() };
    rides.push(ride);
    return ride;
  },

  async updateRide(id, changes) {
    const index = rides.findIndex((ride) => ride.id === id);
    if (index === -1) return null;
    rides[index] = { ...rides[index], ...changes };
    return rides[index];
  },

  /** Mirrors the atomic Mongo version; single-threaded here so a guard suffices. */
  async decrementSeat(id) {
    const index = rides.findIndex((ride) => ride.id === id);
    if (index === -1 || rides[index].seatsAvailable < 1) return null;
    rides[index] = { ...rides[index], seatsAvailable: rides[index].seatsAvailable - 1 };
    return rides[index];
  },

  async incrementSeat(id) {
    const index = rides.findIndex((ride) => ride.id === id);
    if (index === -1) return null;
    rides[index] = { ...rides[index], seatsAvailable: rides[index].seatsAvailable + 1 };
    return rides[index];
  },

  // ---- users ----
  async findUserByStudentId(studentId) {
    return users.find((user) => user.studentId === studentId) ?? null;
  },

  async findUserById(id) {
    return users.find((user) => user.id === id) ?? null;
  },

  async createUser(payload) {
    const user = {
      id: `u${users.length + 1}`,
      rating: null,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    users.push(user);
    return user;
  },

  async updateUser(id, changes) {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...changes };
    return users[idx];
  },

  // ---- trips ----
  async findTripsByUser(userId, status) {
    return trips.filter(
      (trip) => trip.userId === userId && (!status || trip.status === status)
    );
  },

  async createTrip(payload) {
    const trip = { id: `t${tripIdCounter++}`, ...payload, createdAt: new Date().toISOString() };
    trips.push(trip);
    return trip;
  },

  async updateTrip(id, changes) {
    const index = trips.findIndex((trip) => trip.id === id);
    if (index === -1) return null;
    trips[index] = { ...trips[index], ...changes };
    return trips[index];
  },

  // ---- messages ----
  async findMessages(userId) {
    return messages.filter(m => m.senderId === userId || m.receiverId === userId);
  },

  async createMessage(payload) {
    const msg = { id: `m${messageIdCounter++}`, ...payload, createdAt: new Date().toISOString() };
    messages.push(msg);
    return msg;
  },

  async markMessagesAsRead(senderId, receiverId) {
    messages.forEach(m => {
      if (m.senderId === senderId && m.receiverId === receiverId && !m.read) {
        m.read = true;
      }
    });
  }
};
