import type { Request, Response, NextFunction } from "express";
import redis from "../../config/connectRedis.js";
import { ApiError } from "../../utils/error/ApiError.js";

//define Rate limit for the different actions
const RATE_LIMIT = {
  login: { max: 5, window: 60 },
  register: { max: 3, window: 60 },
  forgetPassword: { max: 3, window: 60 },
  verify2FA: { max: 5, window: 60 },
};

export const rateLimiter = (action: keyof typeof RATE_LIMIT) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const key = `ratelimit:${action}:${ip}`; //create unique keys
      const limit = RATE_LIMIT[action];

      //get current attempt
      const attempts = await redis.get(key);
      const currentAttempts = attempts ? parseInt(attempts) : 0; // if attepmt exist convert to number, if attempt null use 0

      if (currentAttempts >= limit.max) {
        const ttl = await redis.ttl(key); // how much time left before expires

        // ✅ Set rateLimit on req even when blocked!
        req.rateLimit = {
          limit: limit.max,
          remaining: 0,
          window: limit.window,
        };

        res.setHeader("X-RateLimit-Limit", limit.max);
        res.setHeader("X-RateLimit-Remaining", 0);
        res.setHeader("X-RateLimit-Reset", ttl);

        console.log(`❌ Rate limit exceeded for ${ip} on ${action} `);
        throw new ApiError(
          429,
          `Too many ${action} attempts. Try again in ${Math.ceil(ttl / 60)} minutes`, //convert second to minute
        );
      }

      //increment counter
      const newAttempts = await redis.incr(key); //increment increase once at time

      // set expiration on first attempt only
      if (newAttempts === 1) {
        await redis.expire(key, limit.window);
        console.log(`Rate limit timer starter for ${ip} on ${action}`);
      }

      //allow request to continue
      const remaining = limit.max - newAttempts;

      req.rateLimit = {
        limit: limit.max,
        remaining,
        window: limit.window,
      };

      res.setHeader("X-RateLimit-Limit", limit.max);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Window", limit.window);

      next();
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      next(error);
    }
  };
};
