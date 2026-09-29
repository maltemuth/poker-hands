/**
 * TypeScript types derived from JSON schemas for CLI output validation
 */

// Base response structure
export interface CLIResponseBase {
  success: boolean;
  command: string;
}

// Success response structure
export interface CLISuccessResponse<T = object> extends CLIResponseBase {
  success: true;
  command: string;
  data: T;
}

// Error response structure
export interface CLIErrorResponse extends CLIResponseBase {
  success: false;
  command: string;
  error: string;
}

// Union type for all CLI responses
export type CLIResponse<T = object> = CLISuccessResponse<T> | CLIErrorResponse;

// Odds command specific types

export interface OddsPlayerData {
  holeCards: string[];
  winChance: number;
  tieChance: number;
}

export interface OddsData {
  players: OddsPlayerData[];
}

export type OddsResponse = CLISuccessResponse<OddsData> | CLIErrorResponse;

// Percentages command specific types

export interface HandTypeData {
  count: number;
  percentage: number;
}

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

export type PercentagesResponse =
  | CLISuccessResponse<PercentagesData>
  | CLIErrorResponse;

// Common utility types

export type CommandName = "odds" | "percentages";

export interface CLIOptions {
  verbose?: boolean;
  format?: "json" | "table" | "pretty";
  json?: boolean;
}

export interface CardInput {
  value: string;
  suit: string;
}
