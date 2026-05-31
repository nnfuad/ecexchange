const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 requests / 15 mins / IP

  max: 15,

  message: {
    message:
      "Too many AI requests. Try again later."
  },

  standardHeaders: true,
  legacyHeaders: false
});

module.exports = chatLimiter;