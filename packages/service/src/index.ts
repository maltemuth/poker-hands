import express, { json } from "express";
import cors from "cors";
import { setupRoutes } from "./routes/index.js";
import { createRateLimiter } from "./middleware/rateLimiter.js";

export class PokerHandsService {
  private app: express.Application;
  private port: number;

  constructor(
    port: number = 3000,
    corsEnabled: boolean = true,
    maxConcurrentRequests: number = 5
  ) {
    this.port = port;
    this.app = express();

    // Setup middleware
    if (corsEnabled) {
      this.app.use(cors());
    }
    this.app.use(json({ limit: "1kb" }));

    // Add rate limiting middleware (POST requests only, exclude health check).
    // Created once, so all requests to this service share the concurrency count.
    this.app.use(createRateLimiter({ maxConcurrentRequests }));

    // Setup routes
    setupRoutes(this.app);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Poker Hands Service running on port ${this.port}`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Export for direct use
export default PokerHandsService;

// Start the service if this file is run directly
if (import.meta.main) {
  // Get command line arguments
  const args = process.argv.slice(2);

  // Parse simple arguments (port, cors flags, and max requests)
  let port = 3000;
  let corsEnabled = true;
  let maxConcurrentRequests = 5;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--port" && i + 1 < args.length) {
      const parsedPort = parseInt(args[i + 1], 10);
      if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
        port = parsedPort;
      }
      i++; // Skip the next argument as it's the port value
    } else if (args[i] === "--no-cors") {
      corsEnabled = false;
    } else if (args[i] === "-p" && i + 1 < args.length) {
      const parsedPort = parseInt(args[i + 1], 10);
      if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
        port = parsedPort;
      }
      i++; // Skip the next argument as it's the port value
    } else if (args[i] === "--max-requests" && i + 1 < args.length) {
      const parsedMaxRequests = parseInt(args[i + 1], 10);
      if (
        !isNaN(parsedMaxRequests) &&
        parsedMaxRequests > 0 &&
        parsedMaxRequests <= 100
      ) {
        maxConcurrentRequests = parsedMaxRequests;
      }
      i++; // Skip the next argument as it's the max requests value
    } else if (args[i] === "-r" && i + 1 < args.length) {
      const parsedMaxRequests = parseInt(args[i + 1], 10);
      if (
        !isNaN(parsedMaxRequests) &&
        parsedMaxRequests > 0 &&
        parsedMaxRequests <= 100
      ) {
        maxConcurrentRequests = parsedMaxRequests;
      }
      i++; // Skip the next argument as it's the max requests value
    }
  }

  const service = new PokerHandsService(
    port,
    corsEnabled,
    maxConcurrentRequests
  );
  service.start();
}
