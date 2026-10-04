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
    db.collection('messages').deleteMany({}),
  ]);
  console.log('Cleared existing collections');

  const password = await hashPassword('password123');

  const { insertedIds } = await collections.users(db).insertMany([
    {
      fullName: 'Rahat Saleh',
      studentId: '0112330001', gender: 'Male',
      email: 'rsaleh1@bscse.uiu.ac.bd',
      phone: '01712345678',
      role: 'driver',
      rating: 4.9,
      password,
      createdAt: new Date().toISOString(),
    },
    {
      fullName: 'Nadia Karim',
      studentId: '0112330002', gender: 'Female',
      email: 'nkarim2@bscse.uiu.ac.bd',
      phone: '01798765432',
      role: 'passenger',
      rating: 4.8,
      password,
      createdAt: new Date().toISOString(),
    },
    {
      fullName: 'Fahim Mahmud',
      studentId: '0112330003',
      email: 'fmahmud3@bscse.uiu.ac.bd',
      phone: '01722222222',
      role: 'driver',
      rating: 4.7,
      password,
      createdAt: new Date().toISOString(),
    },
    {
      fullName: 'Anika Rahman',
      studentId: '0112330004',
      email: 'arahman4@bscse.uiu.ac.bd',
      phone: '01733333333',
      role: 'driver',
      rating: 4.8,
      password,
      createdAt: new Date().toISOString(),
    },
    {
      fullName: 'Tanvir Hasan',
      studentId: '0112330005',
      email: 'thasan5@bscse.uiu.ac.bd',
      phone: '01744444444',
      role: 'driver',
      rating: 4.5,
      password,
      createdAt: new Date().toISOString(),
    }
  ]);

  const rahatId = insertedIds[0].toString();
  const nadiaId = insertedIds[1].toString();
  const fahimId = insertedIds[2].toString();
  const anikaId = insertedIds[3].toString();
  const tanvirId = insertedIds[4].toString();
  console.log('Inserted 5 users');

  const insertedRides = await collections.rides(db).insertMany([
    {
      driverId: rahatId,
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
      driverId: fahimId,
      driver: { name: 'Fahim M.', tag: 'EEE Alumni', rating: '4.7' },
      from: { name: 'UIU Main Campus', detail: 'Parking Zone A' },
      to: { name: 'Uttara House Building', detail: 'Azampur Bus Stand' },
      departureDate: '2026-09-06',
      time: '05:45 PM',
      vehicle: 'Honda Civic (White)',
      genderPreference: 'Male Only',
      acOn: true,
      price: 80,
      seatsAvailable: 3,
      totalSeats: 4,
      createdAt: new Date().toISOString(),
    },
    {
      driverId: nadiaId,
      driver: { name: 'Nadia K.', tag: 'BBA Junior', rating: '5.0' },
      from: { name: 'UIU Main Campus', detail: 'Gate 2' },
      to: { name: 'Dhanmondi 27', detail: 'Plaza AR' },
      departureDate: '2026-09-07',
      time: '01:15 PM',
      vehicle: 'Scooter',
      genderPreference: 'Female Only',
      acOn: false,
      price: 100,
      seatsAvailable: 1,
      totalSeats: 1,
      createdAt: new Date().toISOString(),
    },
    {
      driverId: rahatId,
      driver: { name: 'Rahat S.', tag: 'CS Senior', rating: '4.9' },
      from: { name: 'Badda Link Road', detail: 'Near Gulshan 1' },
      to: { name: 'UIU Main Gate', detail: 'Madani Ave' },
      departureDate: '2026-09-08',
      time: '08:00 AM',
      vehicle: 'Bike',
      genderPreference: 'Male Only',
      acOn: false,
      price: 40,
      seatsAvailable: 1,
      totalSeats: 1,
      createdAt: new Date().toISOString(),
    },
    {
      driverId: anikaId,
      driver: { name: 'Anika R.', tag: 'CSE Faculty', rating: '4.8' },
      from: { name: 'Mirpur 10', detail: 'Metro Station' },
      to: { name: 'UIU Main Campus', detail: 'Faculty Parking' },
      departureDate: '2026-09-09',
      time: '07:30 AM',
      vehicle: 'Toyota Aqua (Silver)',
      genderPreference: 'Mixed Gender',
      acOn: true,
      price: 120,
      seatsAvailable: 4,
      totalSeats: 4,
      createdAt: new Date().toISOString(),
    },
    {
      driverId: tanvirId,
      driver: { name: 'Tanvir H.', tag: 'Masters Student', rating: '4.5' },
      from: { name: 'UIU Main Campus', detail: 'United City' },
      to: { name: 'Mohakhali DOHS', detail: 'Gate 1' },
      departureDate: '2026-09-10',
      time: '06:30 PM',
      vehicle: 'Noah Microbus',
      genderPreference: 'Mixed Gender',
      acOn: true,
      price: 60,
      seatsAvailable: 6,
      totalSeats: 6,
      createdAt: new Date().toISOString(),
    }
  ]);
  console.log('Inserted 6 rides');

  await collections.trips(db).insertMany([
    {
      userId: nadiaId,
      status: 'upcoming',
      date: 'Sep 5, 2026',
      time: '09:30 AM',
      from: 'UIU Main Gate',
      to: 'Banani 11',
      role: 'passenger',
      withPerson: 'Rahat S.',
      price: '৳50',
      rideId: insertedRides.insertedIds[0].toString(),
    },
    {
      userId: nadiaId,
      status: 'upcoming',
      date: 'Sep 6, 2026',
      time: '05:45 PM',
      from: 'UIU Main Campus',
      to: 'Uttara House Building',
      role: 'passenger',
      withPerson: 'Fahim M.',
      price: '৳80',
      rideId: insertedRides.insertedIds[1].toString(),
    },
    {
      userId: nadiaId,
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
      userId: nadiaId,
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
      userId: nadiaId,
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
