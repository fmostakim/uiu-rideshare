import { ObjectId } from 'mongodb';
import { getDb, collections } from './mongo.client.js';

/**
 * MongoDB implementation of the store interface.
 *
 * Mirrors memory.store.js exactly, so services never know which one is active.
 * Mongo's `_id` is mapped to `id` on the way out and back on the way in, which
 * keeps the API response shape identical between the two stores.
 */

const toId = (value) => {
  if (value instanceof ObjectId) return value;
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
};

const serialize = (doc) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
};

const buildRideQuery = (filters = {}) => {
  const { from, to, minSeats, genderPreference, maxPrice } = filters;
  const query = {};

  // Anchored, escaped regex — avoids user input being interpreted as a pattern.
  const contains = (value) => ({
    $regex: String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    $options: 'i',
  });

  if (from) query['from.name'] = contains(from);
  if (to) query['to.name'] = contains(to);
  if (minSeats) query.seatsAvailable = { $gte: Number(minSeats) };
  if (maxPrice) query.price = { $lte: Number(maxPrice) };
  if (genderPreference && genderPreference !== 'No Preference') {
    query.genderPreference = genderPreference;
  }

  return query;
};

export const mongoStore = {
  // ---- rides ----
  async findRides(filters = {}) {
    const db = await getDb();
    const docs = await collections
      .rides(db)
      .find(buildRideQuery(filters))
      .sort({ departureDate: 1, time: 1 })
      .toArray();
    return docs.map(serialize);
  },

  async findRideById(id) {
    const _id = toId(id);
    if (!_id) return null;
    const db = await getDb();
    return serialize(await collections.rides(db).findOne({ _id }));
  },

  async createRide(payload) {
    const db = await getDb();
    const doc = { ...payload, createdAt: new Date().toISOString() };
    const result = await collections.rides(db).insertOne(doc);
    return serialize({ _id: result.insertedId, ...doc });
  },

  async updateRide(id, changes) {
    const _id = toId(id);
    if (!_id) return null;
    const db = await getDb();
    const result = await collections
      .rides(db)
      .findOneAndUpdate({ _id }, { $set: changes }, { returnDocument: 'after' });
    return serialize(result?.value ?? result);
  },

  /**
   * Atomically claim a seat. The `seatsAvailable: { $gte: 1 }` guard makes the
   * check-and-decrement a single operation, so two people clicking "Join Ride"
   * at the same moment cannot oversell the last seat.
   */
  async decrementSeat(id) {
    const _id = toId(id);
    if (!_id) return null;
    const db = await getDb();
    const result = await collections
      .rides(db)
      .findOneAndUpdate(
        { _id, seatsAvailable: { $gte: 1 } },
        { $inc: { seatsAvailable: -1 } },
        { returnDocument: 'after' }
      );
    return serialize(result?.value ?? result);
  },

  async incrementSeat(id) {
    const _id = toId(id);
    if (!_id) return null;
    const db = await getDb();
    const result = await collections
      .rides(db)
      .findOneAndUpdate(
        { _id },
        { $inc: { seatsAvailable: 1 } },
        { returnDocument: 'after' }
      );
    return serialize(result?.value ?? result);
  },

  // ---- users ----
  async findUserByStudentId(studentId) {
    const db = await getDb();
    return serialize(await collections.users(db).findOne({ studentId }));
  },

  async findUserById(id) {
    const _id = toId(id);
    if (!_id) return null;
    const db = await getDb();
    return serialize(await collections.users(db).findOne({ _id }));
  },

  async createUser(payload) {
    const db = await getDb();
    const doc = { rating: null, createdAt: new Date().toISOString(), ...payload };
    const result = await collections.users(db).insertOne(doc);
    return serialize({ _id: result.insertedId, ...doc });
  },

  // ---- trips ----
  async findTripsByUser(userId, status) {
    const db = await getDb();
    const query = { userId };
    if (status) query.status = status;
    const docs = await collections.trips(db).find(query).sort({ date: -1 }).toArray();
    return docs.map(serialize);
  },

  async createTrip(payload) {
    const db = await getDb();
    const doc = { ...payload, createdAt: new Date().toISOString() };
    const result = await collections.trips(db).insertOne(doc);
    return serialize({ _id: result.insertedId, ...doc });
  },

  async updateTrip(id, changes) {
    const _id = toId(id);
    if (!_id) return null;
    const db = await getDb();
    const result = await collections
      .trips(db)
      .findOneAndUpdate({ _id }, { $set: changes }, { returnDocument: 'after' });
    return serialize(result?.value ?? result);
  },
};
