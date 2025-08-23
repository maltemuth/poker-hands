import express, { json } from "express";
import cors from "cors";
import { setupRoutes } from "./routes";

export class PokerHandsService {
  private app: express.Application;
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
    this.app = express();

    // Setup middleware
    this.app.use(cors());
    this.app.use(json({ limit: "1kb" }));

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
