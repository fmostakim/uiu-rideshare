/**
 * Relative URLs on purpose. In development Vite proxies /api to localhost:5000;
 * on Vercel the frontend and API share a domain. Same code path either way, so
 * there is no base URL to configure.
 */

const TOKEN_KEY = 'uiu_rideshare_token';

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
}

const toQuery = (filters = {}) => {
  const entries = Object.entries(filters).filter(
    ([, value]) => value !== '' && value != null
  );
  const query = new URLSearchParams(entries).toString();
  return query ? `?${query}` : '';
};

export const api = {
  // rides
  getRides: (filters) => request(`/rides${toQuery(filters)}`),
  getRide: (id) => request(`/rides/${id}`),
  createRide: (ride) => request('/rides', { method: 'POST', body: ride }),
  joinRide: (id, seats = 1) => request(`/rides/${id}/join`, { method: 'POST', body: { seats } }),

  // auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  me: (token) =>
    request('/auth/me', { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
  forgotPassword: (studentId) => request('/auth/forgot-password', { method: 'POST', body: { studentId } }),
  resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: payload }),

  // trips
  getTrips: (status) => request(`/trips${toQuery({ status })}`),
  getTripSummary: () => request('/trips/summary'),
  cancelTrip: (id) => request(`/trips/${id}/cancel`, { method: 'POST' }),

  // messages
  getConversations: () => request('/messages'),
  sendMessage: (receiverId, text) => request('/messages', { method: 'POST', body: { receiverId, text } }),
  markMessagesRead: (partnerId) => request(`/messages/${partnerId}/read`, { method: 'POST' }),
};
