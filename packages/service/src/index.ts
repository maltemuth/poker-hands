/**
 * Poker Hands Service
 *
 * This service exposes the poker hands library functionality via HTTP and WebSocket endpoints.
 * It provides REST API endpoints for poker hand evaluation, comparison, odds calculation,
 * and real-time WebSocket support for live poker scenarios.
 */

import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";

// Import routes
import { setupRoutes } from "./routes";

// Import middleware
import { setupMiddleware } from "./middleware";

// Import utilities
import { errorHandler } from "./utils";

// Import types
import { ServiceConfig } from "./types";

/**
 * Main service class that sets up and runs the poker hands service
 */
export class PokerHandsService {
  private app: express.Application;
  private server: http.Server;
  private wss: WebSocketServer;
  private config: ServiceConfig;

  constructor(config: Partial<ServiceConfig> = {}) {
    this.config = {
      port: config.port || 3000,
      cors: config.cors || true,
      ...config,
    };

    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupErrorHandling();
  }

  /**
   * Setup middleware for the Express application
   */
  private setupMiddleware(): void {
    setupMiddleware(this.app, this.config);
  }

  /**
   * Setup routes for the Express application
   */
  private setupRoutes(): void {
    setupRoutes(this.app);
  }

  /**
   * Setup WebSocket server for real-time functionality
   */
  private setupWebSocket(): void {
    this.wss.on("connection", (ws) => {
      console.log("WebSocket client connected");

      ws.on("message", (message) => {
        console.log("Received message:", message.toString());
        // Handle WebSocket messages for real-time poker calculations
      });

      ws.on("close", () => {
        console.log("WebSocket client disconnected");
      });
    });
  }

  /**
   * Setup error handling middleware
   */
  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Start the service
   */
  public start(): void {
    this.server.listen(this.config.port, () => {
      console.log(`Poker Hands Service running on port ${this.config.port}`);
      console.log(
        `WebSocket server ready at ws://localhost:${this.config.port}`
      );
    });
  }

  /**
   * Stop the service
   */
  public stop(): void {
    this.server.close(() => {
      console.log("Poker Hands Service stopped");
    });

    this.wss.close(() => {
      console.log("WebSocket server stopped");
    });
  }

  /**
   * Get the Express application instance
   */
  public getApp(): express.Application {
    return this.app;
  }

  /**
   * Get the WebSocket server instance
   */
  public getWebSocketServer(): WebSocketServer {
    return this.wss;
  }
}

/**
 * Create and start the poker hands service with default configuration
 */
export function createService(
  config?: Partial<ServiceConfig>
): PokerHandsService {
  const service = new PokerHandsService(config);
  service.start();
  return service;
}

// Export for direct use
export default PokerHandsService;
