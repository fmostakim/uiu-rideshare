# UIU RideShare

React (Vite) + Tailwind frontend with a Node.js/Express + MongoDB backend, deployed together on Vercel under one domain.

## Structure

```
uiu-rideshare/
├── api/index.js              # Vercel serverless entry — re-exports the Express app
├── server/
│   ├── app.js                # Express app factory (no listen)
│   ├── index.js              # Local dev server
│   ├── routes/               # URL → controller
│   ├── controllers/          # HTTP req/res only
│   ├── services/             # business logic + validation
│   ├── data/
│   │   ├── index.js          #   store selector (memory vs mongo)
│   │   ├── memory.store.js   #   dummy in-memory data
│   │   ├── mongo.store.js    #   MongoDB implementation
│   │   └── mongo.client.js   #   cached connection
│   ├── middleware/           # auth + error handling
│   ├── utils/crypto.js       # password hashing + token signing
│   └── scripts/seed.js       # seeds MongoDB
├── src/
│   ├── api/client.js         # fetch wrapper (relative /api URLs)
│   ├── context/AuthContext   # session state
│   ├── hooks/useRides.js
│   ├── pages/                # Landing, Login, Register, FindRide, OfferRide, MyTrips
│   └── components/
├── vercel.json
└── package.json              # root deps (required for Vercel functions)
```

## Quick start (no database needed)

```bash
npm install
npm run dev
```

Vite runs on `:5173`, the API on `:5000`, and `/api/*` is proxied across. With no `MONGODB_URI` set, the app uses in-memory dummy data.

Seed login: **0112330002** / **password123**

## Switching to MongoDB

1. Create a free cluster at MongoDB Atlas and copy the connection string.
2. `cp server/.env.example server/.env` and fill in:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=uiu_rideshare
   JWT_SECRET=<a long random string>
   ```
3. Seed it: `npm run seed`
4. `npm run dev`

That's the whole switch — `server/data/index.js` picks the store based on `MONGODB_URI`, and both stores implement an identical interface, so no service, controller, or route changes. Confirm which is active at `GET /api/health`.

Indexes (unique `studentId`, ride sort keys, trip lookups) are created automatically on first connect.

## API

| Method | Endpoint                | Auth | Description |
|--------|-------------------------|------|-------------|
| GET    | `/api/health`           | –    | Status + active store |
| GET    | `/api/rides`            | –    | List rides. Filters: `from`, `to`, `minSeats`, `maxPrice`, `genderPreference` |
| GET    | `/api/rides/:id`        | –    | Single ride |
| POST   | `/api/rides`            | –    | Create a ride (used by Offer a Ride) |
| POST   | `/api/rides/:id/join`   | –    | Claim a seat (atomic) |
| POST   | `/api/auth/register`    | –    | `{ fullName, studentId, password, role }` |
| POST   | `/api/auth/login`       | –    | `{ studentId, password }` → `{ user, token }` |
| GET    | `/api/auth/me`          | ✓    | Current user |
| GET    | `/api/trips`            | ✓    | Your trips (`?status=upcoming`) |
| GET    | `/api/trips/summary`    | ✓    | Stats for the summary block |
| POST   | `/api/trips/:id/cancel` | ✓    | Cancel an upcoming trip |

Authenticated routes expect `Authorization: Bearer <token>`.

## Security notes

- Passwords are hashed — `bcryptjs` when installed, otherwise Node's built-in `scrypt`. Plaintext is never stored.
- Tokens are signed with `jsonwebtoken` when available, otherwise an HMAC-SHA256 fallback. Forged or expired tokens are rejected; signature comparison is constant-time.
- Login returns the same error for unknown users and wrong passwords, so student IDs can't be enumerated.
- `JWT_SECRET` **must** be set in production. The dev default is intentionally obvious and insecure.
- Seat claiming uses an atomic `findOneAndUpdate` guarded by `seatsAvailable >= 1`, so simultaneous joins cannot oversell the last seat.

## Deploying to Vercel

Push and import the repo. In **Project Settings → Environment Variables** add `MONGODB_URI`, `MONGODB_DB`, and `JWT_SECRET`. Under Atlas **Network Access**, allow `0.0.0.0/0` (Vercel's function IPs are dynamic).

Two things that commonly trip people up:

- **Backend deps live in the root `package.json`.** Vercel installs from the root when bundling functions — keeping `express`/`mongodb` only in `server/package.json` is the usual cause of a failed deploy. `server/package.json` exists so the backend can also run standalone.
- **Without `MONGODB_URI`, production data won't persist.** Serverless functions are stateless, so in-memory writes vanish between invocations.

## Note on images

Image URLs in `src/assets/*.js` are temporary Figma exports that expire ~7 days after generation. Download them and switch to local imports before deploying.
