import { MongoClient } from 'mongodb';

/**
 * Cached MongoDB connection.
 *
 * Serverless functions may be invoked concurrently and re-use the same warm
 * container, so we cache the *promise* on globalThis. Caching the promise (not
 * the resolved client) means simultaneous cold-start requests share one
 * connection attempt instead of each opening their own — which is how
 * serverless apps exhaust an Atlas connection pool.
 */

const globalCache = globalThis.__uiuMongo ?? (globalThis.__uiuMongo = { promise: null });

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!globalCache.promise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });

    globalCache.promise = client
      .connect()
      .then(async (connected) => {
        const db = connected.db(process.env.MONGODB_DB || 'uiu_rideshare');
        await ensureIndexes(db);
        return db;
      })
      .catch((err) => {
        // Clear the cache so the next request retries instead of reusing a
        // permanently rejected promise.
        globalCache.promise = null;
        throw err;
      });
  }

  return globalCache.promise;
}

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('users').createIndex({ studentId: 1 }, { unique: true }),
    db.collection('rides').createIndex({ departureDate: 1, time: 1 }),
    db.collection('trips').createIndex({ userId: 1, status: 1 }),
  ]);
}

export const collections = {
  users: (db) => db.collection('users'),
  rides: (db) => db.collection('rides'),
  trips: (db) => db.collection('trips'),
};
