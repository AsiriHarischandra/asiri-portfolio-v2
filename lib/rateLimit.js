// In-memory rate limiter.
// On Vercel serverless each cold start resets the map, so this is
// "best effort" — good enough for a portfolio, not for a bank.

const store = new Map();

/**
 * @param {string} key    — usually the IP address
 * @param {number} limit  — max requests allowed in the window
 * @param {number} windowMs — window size in milliseconds
 * @returns {{ allowed: boolean, remaining: number }}
 */
export function rateLimit(key, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.start > windowMs) {
    store.set(key, { count: 1, start: now });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: limit - entry.count };
}

// Clean up old entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now - entry.start > 30 * 60 * 1000) store.delete(key);
    }
  }, 10 * 60 * 1000);
}
