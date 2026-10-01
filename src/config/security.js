const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ==========================================
// SECURITY HEADERS
// ==========================================

const securityHeaders = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
});

// ==========================================
// GENERAL API RATE LIMITER
// ==========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// ==========================================
// AUTH RATE LIMITER
// ==========================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },
});

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  securityHeaders,
  apiLimiter,
  authLimiter,
};