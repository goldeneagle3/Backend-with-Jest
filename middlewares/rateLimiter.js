const rateLimit = require('express-rate-limit');

module.exports.rateLimiterUsingThirdParty = rateLimit({
  windowMs: 60000 * 2,
  max: 100,
  message: 'You have exceeded the 10 requests in 2 min limit!',
  headers: true,
});
