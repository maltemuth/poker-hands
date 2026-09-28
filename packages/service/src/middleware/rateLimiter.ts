import { Request, Response, NextFunction } from "express";

interface RateLimiterOptions {
  maxConcurrentRequests: number;
}

type HoldSlot = (work: Promise<unknown>) => void;

/**
 * Keeps the request's concurrency slot occupied until `work` has settled,
 * even if the response has already been sent or the client disconnected.
 * Use it for calculations that keep running on their own.
 */
export function holdSlotUntil(res: Response, work: Promise<unknown>): void {
  (res.locals.holdSlotUntil as HoldSlot | undefined)?.(work);
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
      return res.status(429).json("Too many concurrent requests");
    }

    // Track the request
    activeRequests += 1;

    const heldWork: Promise<unknown>[] = [];
    res.locals.holdSlotUntil = ((work) => {
      heldWork.push(work);
    }) satisfies HoldSlot;

    // Free the slot once the response has ended and all held work has settled
    let ended = false;
    const cleanup = () => {
      if (ended) return;
      ended = true;
      Promise.allSettled(heldWork).then(() => {
        activeRequests -= 1;
      });
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
