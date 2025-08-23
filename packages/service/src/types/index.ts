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
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  /** Success status */
  success: boolean;
  /** Data payload */
  data?: T;
  /** Error message */
  error?: string;
  /** Request timestamp */
  timestamp: string;
}
