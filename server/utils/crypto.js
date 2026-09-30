import crypto from 'node:crypto';

/**
 * Password hashing and token signing.
 *
 * Prefers bcryptjs + jsonwebtoken when installed. If they are not present we
 * fall back to Node's built-in scrypt and an HMAC-signed token, so the app
 * still runs — and is still cryptographically sound — with zero extra
 * dependencies. Both paths are real hashing; neither stores plaintext.
 */

let bcrypt = null;
let jwt = null;

try {
  ({ default: bcrypt } = await import('bcryptjs'));
} catch {
  /* fall back to scrypt */
}
try {
  ({ default: jwt } = await import('jsonwebtoken'));
} catch {
  /* fall back to HMAC */
}

const SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// ---------- passwords ----------

export async function hashPassword(plain) {
  if (bcrypt) return bcrypt.hash(plain, 10);

  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export async function verifyPassword(plain, stored) {
  if (!stored) return false;

  if (stored.startsWith('scrypt$')) {
    const [, salt, expected] = stored.split('$');
    const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
    // Constant-time compare to avoid leaking information through timing.
    return (
      derived.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(expected))
    );
  }

  if (stored.startsWith('$2')) {
    if (!bcrypt) return false;
    return bcrypt.compare(plain, stored);
  }

  // Legacy plaintext seed rows in the in-memory store.
  return plain === stored;
}

// ---------- tokens ----------

const base64url = (input) => Buffer.from(input).toString('base64url');

export function signToken(user) {
  if (jwt) {
    return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
  }

  const payload = base64url(
    JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + TOKEN_TTL_MS })
  );
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyToken(token) {
  if (!token) return null;

  if (jwt) {
    try {
      return jwt.verify(token, SECRET);
    } catch {
      return null;
    }
  }

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (decoded.exp && decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}
