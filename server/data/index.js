import { memoryStore } from './memory.store.js';

/**
 * Single swap point for the data layer.
 *
 * If MONGODB_URI is set we use MongoDB, otherwise the in-memory dummy data.
 * The mongo module is imported *dynamically* so that the `mongodb` package is
 * only required when it is actually being used — the app still boots in memory
 * mode on a machine where the driver was never installed.
 *
 * Both stores implement the identical interface:
 *   findRides, findRideById, createRide, updateRide, decrementSeat,
 *   findUserByStudentId, findUserById, createUser,
 *   findTripsByUser, createTrip, updateTrip
 */

export const usingMongo = () => Boolean(process.env.MONGODB_URI);

let backendPromise = null;

async function resolveStore() {
  if (!usingMongo()) return memoryStore;

  if (!backendPromise) {
    backendPromise = import('./mongo.store.js')
      .then((module) => module.mongoStore)
      .catch((err) => {
        backendPromise = null;
        throw new Error(
          `MONGODB_URI is set but the MongoDB store could not be loaded. ` +
            `Did you run "npm install mongodb"? Original error: ${err.message}`
        );
      });
  }
  return backendPromise;
}

const METHODS = [
  'findRides',
  'findRideById',
  'createRide',
  'updateRide',
  'decrementSeat',
  'incrementSeat',
  'findUserByStudentId',
  'findUserById',
  'createUser',
  'findTripsByUser',
  'createTrip',
  'updateTrip',
  'findMessages',
  'createMessage',
  'markMessagesAsRead',
];

/**
 * A thin facade that forwards each call to whichever store is active. Callers
 * just `import { store }` and await normally.
 */
export const store = Object.fromEntries(
  METHODS.map((method) => [
    method,
    async (...args) => {
      const backend = await resolveStore();
      return backend[method](...args);
    },
  ])
);
