/**
 * Type definitions for the Poker Hands Service
 */

/**
 * Request interface for odds calculation
 */
export interface OddsRequest {
  /** Array of hole card arrays (each representing a player) */
  holes: string[][];
  /** Community cards (optional) */
  board?: string[];
  /** Calculation options (optional) */
  options?: {
    /** Calculation mode (auto, exhaustive, monteCarlo) */
    mode?: "auto" | "exhaustive" | "monteCarlo";
    /** Threshold for auto mode (default: 10000) */
    threshold?: number;
    /** Sample size for monte-carlo mode (default: 10000) */
    sampleSize?: number;
  };
}

/**
 * Odds of a single player in the odds response
 */
export interface OddsPlayerData {
  /** The player's hole cards, e.g. ["Ah", "Kh"] */
  holeCards: string[];
  /** Probability of winning outright (0 to 1) */
  winChance: number;
  /** Probability of tying (0 to 1) */
  tieChance: number;
  /** 95% margin of error of winChance, only for Monte Carlo results */
  winChanceError?: number;
}

/**
 * Response body of the odds endpoint
 */
export interface OddsData {
  /** One entry per player, in the order of the request's holes */
  players: OddsPlayerData[];
}

/**
 * API response wrapper
 */
export type ApiResponse<T = unknown> = T | string;
