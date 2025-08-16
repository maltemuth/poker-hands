/**
 * Utility functions for the Poker Hands Service
 */

import { Request, Response, NextFunction } from "express";
import { ApiResponse, ApiError, ApiErrorType } from "../types";

/**
 * Error handling middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error);

  // Handle specific error types
  if (error.name === "ValidationError") {
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
    return;
  }

  if (error.name === "SyntaxError") {
    res.status(400).json({
      success: false,
      error: "Invalid JSON payload",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
    return;
  }

  // Default to 500 server error
  res.status(500).json({
    success: false,
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

/**
 * Format response with consistent structure
 */
export const formatResponse = <T>(
  success: boolean,
  data?: T,
  error?: string
): ApiResponse<T> => {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Validate card string format
 */
export const isValidCard = (card: string): boolean => {
  const cardRegex = /^[2-9TJQKA][hdsc]$/;
  return cardRegex.test(card);
};

/**
 * Validate array of card strings
 */
export const isValidCardArray = (cards: string[]): boolean => {
  if (!Array.isArray(cards)) return false;
  return cards.every((card) => isValidCard(card));
};

/**
 * Calculate response time
 */
export const calculateResponseTime = (startTime: number): number => {
  return Date.now() - startTime;
};

/**
 * Log request with timing information
 */
export const logRequest = (
  req: Request,
  res: Response,
  startTime: number
): void => {
  const responseTime = calculateResponseTime(startTime);
  console.log(
    `${req.method} ${req.path} - ${res.statusCode || "200"} - ${responseTime}ms`
  );
};

/**
 * Create standardized error responses
 */
export const createError = (
  statusCode: number,
  message: string,
  details?: any
): { statusCode: number; message: string; details?: any } => {
  return {
    statusCode,
    message,
    details,
  };
};

/**
 * Sanitize input data to prevent injection attacks
 */
export const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    // Remove potentially dangerous characters
    return input.replace(/[<>]/g, "");
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item));
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }

  return input;
};

/**
 * Validate request body structure
 */
export const validateRequestBody = (schema: any): any => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0].message,
        timestamp: new Date().toISOString(),
      } as ApiResponse);
      return;
    }
    next();
  };
};

/**
 * Generate unique request ID
 */
export const generateRequestId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Cache utility for expensive operations
 */
export class SimpleCache<T> {
  private cache: Map<string, { value: T; timestamp: number; ttl?: number }> =
    new Map();

  constructor(private defaultTTL?: number) {}

  set(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if item has expired
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Create a simple cache instance for the service
 */
export const responseCache = new SimpleCache<any>(5 * 60 * 1000); // 5 minute TTL

/**
 * Memoization decorator for expensive functions
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Validate poker hand input
 */
export const validatePokerHandInput = (
  cards: string[]
): { error: string } | null => {
  if (!Array.isArray(cards)) {
    return { error: "Cards must be provided as an array" };
  }

  if (cards.length < 5) {
    return { error: "At least 5 cards are required to form a poker hand" };
  }

  if (cards.length > 7) {
    return { error: "Maximum 7 cards allowed for hand evaluation" };
  }

  // Validate each card format
  const cardRegex = /^[2-9TJQKA][hdsc]$/;
  for (let i = 0; i < cards.length; i++) {
    if (typeof cards[i] !== "string" || !cardRegex.test(cards[i])) {
      return {
        error: `Invalid card format at index ${i}: ${cards[i]}. Expected format like 'As', 'Kd', 'Qc'`,
      };
    }
  }

  return null;
};

/**
 * Validate odds calculation input
 */
export const validateOddsInput = (
  holes: string[][],
  board?: string[]
): { error: string } | null => {
  if (!Array.isArray(holes) || holes.length < 2) {
    return {
      error: "Holes must be provided as an array with at least 2 players",
    };
  }

  // Validate each player's hole cards
  for (let i = 0; i < holes.length; i++) {
    if (!Array.isArray(holes[i]) || holes[i].length !== 2) {
      return { error: `Player ${i + 1} must have exactly 2 hole cards` };
    }

    const playerError = validatePokerHandInput(holes[i]);
    if (playerError) {
      return playerError;
    }
  }

  // Validate board cards if provided
  if (board) {
    if (!Array.isArray(board)) {
      return { error: "Board must be provided as an array" };
    }

    if (board.length > 5) {
      return { error: "Maximum 5 board cards allowed" };
    }

    const boardError = validatePokerHandInput(board);
    if (boardError) {
      return boardError;
    }
  }

  return null;
};

/**
 * Format hand type for response
 */
export const formatHandType = (type: string): string => {
  return type.replace(/([A-Z])/g, " $1").trim();
};

/**
 * Calculate hand rank description
 */
export const getHandRankDescription = (rank: number): string => {
  if (rank >= 1 && rank <= 10) {
    const descriptions = [
      "High Card",
      "Pair",
      "Two Pair",
      "Three of a Kind",
      "Straight",
      "Flush",
      "Full House",
      "Four of a Kind",
      "Straight Flush",
      "Royal Flush",
    ];
    return descriptions[rank - 1];
  }
  return "Unknown";
};

/**
 * Sanitize and normalize card input
 */
export const normalizeCardInput = (cards: string[]): string[] => {
  return cards
    .map((card) => card.trim().toLowerCase())
    .filter((card) => /^[2-9tjqka][hdsc]$/.test(card))
    .map((card) => card.charAt(0).toUpperCase() + card.charAt(1));
};

/**
 * Check for duplicate cards
 */
export const hasDuplicateCards = (cards: string[]): boolean => {
  const uniqueCards = new Set(cards);
  return uniqueCards.size !== cards.length;
};

/**
 * Get unique cards from input
 */
export const getUniqueCards = (cards: string[]): string[] => {
  return [...new Set(cards)];
};
