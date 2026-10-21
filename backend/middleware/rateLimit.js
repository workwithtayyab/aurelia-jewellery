// Small dependency-free, in-memory rate limiter.
//
// Good enough for a single Render instance. If you ever run several
// instances, move this to a shared store (e.g. Redis / express-rate-limit).

const MAX_TRACKED_KEYS = 10000;

const createRateLimiter = ({ windowMs, max, keyGenerator, message }) => {
  const hits = new Map();

  const sweep = () => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  };

  // unref() so this timer never keeps the process alive on shutdown.
  setInterval(sweep, Math.min(windowMs, 60 * 1000)).unref();

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Hard cap so a flood of unique keys cannot exhaust memory.
    if (hits.size >= MAX_TRACKED_KEYS) {
      sweep();
      if (hits.size >= MAX_TRACKED_KEYS) hits.clear();
    }

    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({
        message: message || "Too many requests. Please try again later.",
      });
    }

    return next();
  };
};

const emailFrom = (req) =>
  String(req.body?.email || "")
    .trim()
    .toLowerCase()
    .slice(0, 254);

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

// Per IP + email: stops password guessing against one account.
const loginAccountLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES,
  max: 10,
  keyGenerator: (req) => `login:${req.ip}:${emailFrom(req)}`,
  message: "Too many login attempts. Please try again in a few minutes.",
});

// Per IP: stops one client cycling through many emails.
const loginIpLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES,
  max: 100,
  keyGenerator: (req) => `login-ip:${req.ip}`,
  message: "Too many login attempts. Please try again in a few minutes.",
});

const registerLimiter = createRateLimiter({
  windowMs: ONE_HOUR,
  max: 30,
  keyGenerator: (req) => `register:${req.ip}`,
  message: "Too many sign-up attempts. Please try again later.",
});

module.exports = {
  createRateLimiter,
  loginLimiters: [loginIpLimiter, loginAccountLimiter],
  registerLimiter,
};
