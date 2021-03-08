import * as rateLimit from 'express-rate-limit';

export const ratelimitConfig = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'too many request for this ip, please try again after 1 hour',
});
