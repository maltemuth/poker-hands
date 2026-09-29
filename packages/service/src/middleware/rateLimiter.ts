import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils";

interface RateLimiterOptions {
  maxConcurrentRequests: number;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { maxConcurrentRequests } = options;
  let activeRequests = 0;

  return (req: Request, res: Response, next: NextFunction) => {
    // Only apply rate limiting to POST requests
    if (req.method !== "POST") {
      return next();
    }

    // Exclude health check endpoint
    if (req.path === "/health") {
      return next();
    }

    if (activeRequests >= maxConcurrentRequests) {
      return sendError(res, 429, "Too many concurrent requests");
    }

    // Track the request
    activeRequests += 1;

    // Free the slot once the response has ended
    let ended = false;
    const cleanup = () => {
      if (ended) return;
      ended = true;
      activeRequests -= 1;
    };

    // Add cleanup to response and error handlers
    res.on("finish", cleanup);
    res.on("close", cleanup);

    next();
  };
}

// Default rate limiter instance
export const rateLimiter = createRateLimiter({
  maxConcurrentRequests: 5,
});
