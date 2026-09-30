export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Wraps async route handlers so rejected promises reach the error handler. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: `No route matches ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars -- Express requires the 4-arg signature.
export const errorHandler = (err, req, res, next) => {
  const status = err.status ?? 500;

  if (status >= 500) console.error(err);

  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message,
  });
};
