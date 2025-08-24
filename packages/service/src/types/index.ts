/**
 * Type definitions for the Poker Hands Service
 */

// Import CLI types from the CLI package for consistency
import {
  CLIResponseBase,
  CLISuccessResponse,
  CLIErrorResponse,
  CLIResponse,
  OddsData,
  OddsPlayerData,
  PercentagesData,
  HandTypeData,
  CommandName,
  CLIOptions,
  CardInput,
  CLIOddsResponse,
  CLIPercentagesResponse,
} from "@malte.muth/poker-hands-cli";

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
export interface ServiceOddsResponse {
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
export type ApiResponse<T = unknown> = T | string;

// Re-export CLI types for convenience
export {
  CLIResponseBase,
  CLISuccessResponse,
  CLIErrorResponse,
  CLIResponse,
  OddsData,
  OddsPlayerData,
  PercentagesData,
  HandTypeData,
  CommandName,
  CLIOptions,
  CardInput,
  CLIOddsResponse,
  CLIPercentagesResponse,
};
