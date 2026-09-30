/**
 * Seeds MongoDB with starter users, rides and trips.
 *
 *   cd server && npm run seed
 *
 * Safe to re-run: it clears the three collections first. Passwords are hashed
 * with the same function the auth service uses, so the seeded accounts log in
 * normally.
 */
import 'dotenv/config';
import { getDb, collections } from '../data/mongo.client.js';
import { hashPassword } from '../utils/crypto.js';

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Add it to server/.env first.');
    process.exit(1);
  }

  const db = await getDb();
  console.log(`Connected to "${db.databaseName}"`);

  await Promise.all([
    collections.users(db).deleteMany({}),
    collections.rides(db).deleteMany({}),
    collections.trips(db).deleteMany({}),
  ]);
  console.log('Cleared existing collections');

  const password = await hashPassword('password123');

  const { insertedIds } = await collections.users(db).insertMany([
    {
      fullName: 'Rahat Saleh',
      studentId: '0112330001',
      email: 'rsaleh1@bscse.uiu.ac.bd',
      phone: '01712345678',
      role: 'driver',
      rating: 4.9,
      password,
      createdAt: new Date().toISOString(),
    },
    {
      fullName: 'Nadia Karim',
      studentId: '0112330002',
      email: 'nkarim2@bscse.uiu.ac.bd',
      phone: '01798765432',
      role: 'passenger',
      rating: 4.8,
      password,
      createdAt: new Date().toISOString(),
    },
  ]);

  const driverId = insertedIds[0].toString();
  const passengerId = insertedIds[1].toString();
  console.log('Inserted 2 users');

  await collections.rides(db).insertMany([
    {
      driverId,
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
      createdAt: new Date().toISOString(),
    },
    {
      driverId,
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
      createdAt: new Date().toISOString(),
    },
  ]);
  console.log('Inserted 2 rides');

  await collections.trips(db).insertMany([
    {
      userId: passengerId,
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
      userId: passengerId,
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
      userId: passengerId,
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
      userId: passengerId,
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
      userId: passengerId,
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
  ]);
  console.log('Inserted 5 trips');

  console.log('\nSeed complete. Log in with 0112330002 / password123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
