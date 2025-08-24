import { Request, Response, NextFunction } from "express";

interface RateLimiterOptions {
  maxConcurrentRequests: number;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { maxConcurrentRequests } = options;
  let activeRequests = [] as Request[];

  return (req: Request, res: Response, next: NextFunction) => {
    // Only apply rate limiting to POST requests
    if (req.method !== "POST") {
      return next();
    }

    // Exclude health check endpoint
    if (req.path === "/health") {
      return next();
    }

    if (activeRequests.length >= maxConcurrentRequests) {
      return res.status(429).json("Too many concurrent requests");
    }

    // Track the request
    activeRequests.push(req);

    // Add cleanup handler
    const cleanup = () => {
      activeRequests = activeRequests.filter((_) => _ !== req);
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
