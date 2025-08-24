import express, { json } from "express";
import cors from "cors";
import { setupRoutes } from "./routes";
import { rateLimiter } from "./middleware/rateLimiter";

export class PokerHandsService {
  private app: express.Application;
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
    this.app = express();

    // Setup middleware
    this.app.use(cors());
    this.app.use(json({ limit: "1kb" }));

    // Add rate limiting middleware (POST requests only, exclude health check)
    this.app.use((req, res, next) => {
      if (req.method !== "POST" || req.path === "/health") {
        return next();
      }
      return rateLimiter(req, res, next);
    });

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
if (require.main === module) {
  const service = new PokerHandsService();
  service.start();
}
