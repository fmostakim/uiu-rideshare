import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import ridesRoutes from './routes/rides.routes.js';
import authRoutes from './routes/auth.routes.js';
import tripsRoutes from './routes/trips.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { usingMongo } from './data/index.js';

/**
 * Builds the Express app but does NOT call listen().
 *
 * That separation is what lets the same app run as a normal server locally
 * (server/index.js) and as a Vercel serverless function (api/index.js).
 */
export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', storage: usingMongo() ? 'mongodb' : 'in-memory' });
  });

  app.use('/api/rides', ridesRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/trips', tripsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp();
