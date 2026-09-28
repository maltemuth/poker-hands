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

/**
 * Request interface for hand type percentages
 */
export interface PercentagesRequest {
  /** Array of hole card arrays (each representing a player) */
  holes: string[][];
  /** Community cards (optional) */
  board?: string[];
}

/**
 * How often a hand type occurs among all possible boards
 */
export interface HandTypeData {
  /** Number of boards on which the player makes this hand type */
  count: number;
  /** Share of all possible boards (0 to 1) */
  percentage: number;
}

/**
 * Hand type distribution of a single player
 */
export interface PercentagesData {
  highCard: HandTypeData;
  pair: HandTypeData;
  twoPair: HandTypeData;
  threeOfAKind: HandTypeData;
  straight: HandTypeData;
  flush: HandTypeData;
  fullHouse: HandTypeData;
  fourOfAKind: HandTypeData;
  straightFlush: HandTypeData;
  royalFlush: HandTypeData;
}

/**
 * Percentages of a single player in the percentages response
 */
export interface PercentagesPlayerData {
  /** The player's hole cards, e.g. ["Ah", "Kh"] */
  holeCards: string[];
  /** How often the player makes each hand type */
  percentages: PercentagesData;
}

/**
 * Response body of the percentages endpoint
 */
export interface PercentagesResponse {
  /** One entry per player, in the order of the request's holes */
  players: PercentagesPlayerData[];
}
