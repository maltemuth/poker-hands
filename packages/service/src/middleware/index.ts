/**
 * Middleware setup for the Poker Hands Service
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { ServiceConfig } from "../types";

/**
 * Setup middleware for the Express application
 * @param app Express application instance
 * @param config Service configuration
 */
export function setupMiddleware(
  app: express.Application,
  config: ServiceConfig
): void {
  // Enable CORS if configured
  if (config.cors) {
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
  }

  // Parse JSON bodies
  app.use(express.json({ limit: "10mb" }));

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "poker-hands-service",
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: "Endpoint not found",
      timestamp: new Date().toISOString(),
    });
  });
}

/**
 * Validation middleware for card inputs
 */
export const validateCards = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { cards } = req.body;

  if (!cards || !Array.isArray(cards)) {
    res.status(400).json({
      success: false,
      error: "Cards must be provided as an array",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Validate each card format
  const cardRegex = /^[2-9TJQKA][hdsc]$/;
  for (let i = 0; i < cards.length; i++) {
    if (typeof cards[i] !== "string" || !cardRegex.test(cards[i])) {
      res.status(400).json({
        success: false,
        error: `Invalid card format at index ${i}: ${cards[i]}. Expected format like 'As', 'Kd', 'Qc'`,
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }

  next();
};

/**
 * Validation middleware for odds calculation inputs
 */
export const validateOddsRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { holes, board } = req.body;

  if (!holes || !Array.isArray(holes) || holes.length < 2) {
    res.status(400).json({
      success: false,
      error: "Holes must be provided as an array with at least 2 players",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Validate each player's hole cards
  for (let i = 0; i < holes.length; i++) {
    if (!Array.isArray(holes[i]) || holes[i].length !== 2) {
      res.status(400).json({
        success: false,
        error: `Player ${i + 1} must have exactly 2 hole cards`,
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }

  // Validate board cards if provided
  if (board) {
    if (!Array.isArray(board)) {
      res.status(400).json({
        success: false,
        error: "Board must be provided as an array",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validate each board card
    const cardRegex = /^[2-9TJQKA][hdsc]$/;
    for (let i = 0; i < board.length; i++) {
      if (typeof board[i] !== "string" || !cardRegex.test(board[i])) {
        res.status(400).json({
          success: false,
          error: `Invalid board card format at index ${i}: ${board[i]}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }
  }

  next();
};

/**
 * Rate limiting middleware (placeholder for future implementation)
 */
export const rateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // TODO: Implement rate limiting
  next();
};

/**
 * Authentication middleware (placeholder for future implementation)
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // TODO: Implement authentication
  next();
};
