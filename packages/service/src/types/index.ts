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
}

/**
 * Response interface for odds calculation
 */
export interface OddsResponse {
  /** Winning probabilities for each player */
  winProbabilities: number[];
  /** Hand type probabilities for each player */
  handTypeProbabilities: Array<{
    highCard: number;
    pair: number;
    twoPair: number;
    threeOfAKind: number;
    straight: number;
    flush: number;
    fullHouse: number;
    fourOfAKind: number;
    straightFlush: number;
    royalFlush: number;
  }>;
}

/**
 * CLI Odds Response format (matches CLI output schema)
 */
export interface CliOddsResponse {
  /** Whether the calculation was successful */
  success: boolean;
  /** The command that was executed */
  command: "odds";
  /** Odds data for players */
  data?: {
    /** Array of players with their hole cards and odds */
    players: Array<{
      /** The player's hole cards */
      holeCards: string[];
      /** Probability of winning (0-1) */
      winChance: number;
      /** Probability of tying (0-1) */
      tieChance: number;
      /** Confidence interval for win chance (Monte Carlo only) */
      winChanceError?: number;
    }>;
  };
  /** Error message if the calculation failed */
  error?: string;
}

/**
 * API response wrapper
 */
export type ApiResponse<T = unknown> = T | string;
