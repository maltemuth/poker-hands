#!/usr/bin/env node

import { Command } from "commander";
import { PokerHandsService } from "./index";
import { version } from "../package.json";

const program = new Command();

program
  .name("poker-hands-service")
  .description("CLI for starting the Poker Hands Service")
  .version(version);

program
  .command("start")
  .description("Start the Poker Hands Service")
  .option("-p, --port <port>", "Port to run the service on", "3000")
  .option("--no-cors", "Disable CORS headers")
  .option(
    "-r, --max-requests <maxRequests>",
    "Maximum concurrent requests (default: 5)",
    "5"
  )
  .action(
    (options: { port?: string; cors?: boolean; maxRequests?: string }) => {
      try {
        const port = parseInt(options.port || "3000", 10);
        const corsEnabled = options.cors !== false;
        const maxConcurrentRequests = parseInt(options.maxRequests || "5", 10);

        if (isNaN(port) || port < 1 || port > 65535) {
          console.error("Error: Port must be a number between 1 and 65535");
          process.exit(1);
        }

        if (
          isNaN(maxConcurrentRequests) ||
          maxConcurrentRequests < 1 ||
          maxConcurrentRequests > 100
        ) {
          console.error(
            "Error: Max concurrent requests must be a number between 1 and 100"
          );
          process.exit(1);
        }

        console.log(`Starting Poker Hands Service...`);
        console.log(`Port: ${port}`);
        console.log(`CORS: ${corsEnabled ? "enabled" : "disabled"}`);
        console.log(`Max Concurrent Requests: ${maxConcurrentRequests}`);
        console.log("Press Ctrl+C to stop the service");

        const service = new PokerHandsService(
          port,
          corsEnabled,
          maxConcurrentRequests
        );
        service.start();

        // Handle graceful shutdown
        process.on("SIGINT", () => {
          console.log("\nShutting down gracefully...");
          process.exit(0);
        });

        process.on("SIGTERM", () => {
          console.log("\nShutting down gracefully...");
          process.exit(0);
        });
      } catch (error) {
        console.error(
          "Error starting service:",
          error instanceof Error ? error.message : "Unknown error"
        );
        process.exit(1);
      }
    }
  );

// Parse command line arguments
program.parse();
