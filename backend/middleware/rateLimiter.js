// Simple in-memory rate limiter
// For production, consider using Redis-based rate limiting

const requestCounts = new Map();

/**
 * Rate limiting middleware
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 */
export function createRateLimiter(maxRequests = 100, windowMs = 60000) {
  return (req, res, next) => {
    const identifier = req.user?._id?.toString() || req.ip;

    const now = Date.now();
    const userRequests = requestCounts.get(identifier) || [];

    // Filter out old requests outside the time window
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < windowMs
    );

    if (recentRequests.length >= maxRequests) {
      const retryAfter = Math.ceil(
        (recentRequests[0] + windowMs - now) / 1000
      );

      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      });
    }

    // Add current request timestamp
    recentRequests.push(now);
    requestCounts.set(identifier, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance to clean up
      cleanupOldEntries(windowMs);
    }

    next();
  };
}

/**
 * Clean up old entries from the rate limiter
 */
function cleanupOldEntries(windowMs) {
  const now = Date.now();
  for (const [identifier, timestamps] of requestCounts.entries()) {
    const recentRequests = timestamps.filter(
      (timestamp) => now - timestamp < windowMs
    );

    if (recentRequests.length === 0) {
      requestCounts.delete(identifier);
    } else {
      requestCounts.set(identifier, recentRequests);
    }
  }
}
