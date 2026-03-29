/**
 * Global Express error handler.
 * Catches errors forwarded via next(err) from routes and middleware.
 */
export const errorMiddleware = (err, _req, res, _next) => {
  console.error('[Error]', err.message);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected error occurred.',
  });
};
