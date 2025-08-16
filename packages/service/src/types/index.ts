/**
 * Type definitions for the Poker Hands Service
 */

/**
 * Configuration interface for the Poker Hands Service
 */
export interface ServiceConfig {
  /** Port number for the HTTP server */
  port: number;
  /** Enable CORS support */
  cors: boolean;
  /** Additional configuration options */
  [key: string]: any;
}

/**
 * All possible hand types, in order from lowest to highest
 */
export enum HandType {
  HighCard = 1,
  Pair,
  TwoPair,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalFlush,
}

/**
 * Request interface for poker hand evaluation
 */
export interface BestHandRequest {
  /** Array of card strings (e.g., ['As', 'Kd', 'Qc', 'Jh', 'Ts', '9h', '8d']) */
  cards: string[];
}

/**
 * Response interface for poker hand evaluation
 */
export interface BestHandResponse {
  /** The best hand found */
  hand: {
    /** Hand type (e.g., 'straight', 'flush', 'fullHouse') */
    type: HandType;
    /** Cards that make up the hand */
    cards: string[];
    /** Hand rank for comparison */
    rank: number;
  };
  /** All possible hands from the input cards */
  allHands: Array<{
    type: HandType;
    cards: string[];
    rank: number;
  }>;
}

/**
 * Request interface for hand comparison
 */
export interface CompareHandsRequest {
  /** First hand cards */
  hand1: string[];
  /** Second hand cards */
  hand2: string[];
}

/**
 * Response interface for hand comparison
 */
export interface CompareHandsResponse {
  /** Result of comparison ('hand1', 'hand2', 'tie') */
  result: "hand1" | "hand2" | "tie";
  /** Details of both hands */
  hands: {
    hand1: {
      type: HandType;
      cards: string[];
      rank: number;
    };
    hand2: {
      type: HandType;
      cards: string[];
      rank: number;
    };
  };
}

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
 * Request interface for percentages calculation
 */
export interface PercentagesRequest {
  /** Hole cards */
  cards: string[];
  /** Community cards (optional) */
  board?: string[];
}

/**
 * Response interface for percentages calculation
 */
export interface PercentagesResponse {
  /** Hand type percentages */
  [key: string]: {
    count: number;
    percentage: number;
  };
}

/**
 * Error types
 */
export enum ApiErrorType {
  VALIDATION_ERROR = "ValidationError",
  CARD_FORMAT_ERROR = "CardFormatError",
  INVALID_INPUT_ERROR = "InvalidInputError",
  INTERNAL_ERROR = "InternalError",
}

/**
 * Detailed error interface
 */
export interface ApiError {
  /** Error type */
  type: ApiErrorType;
  /** Error message */
  message: string;
  /** Error details (optional) */
  details?: any;
  /** Error timestamp */
  timestamp: string;
}

/**
 * WebSocket message types
 */
export enum WebSocketMessageType {
  /** Request for best hand evaluation */
  BEST_HAND = "bestHand",
  /** Request for hand comparison */
  COMPARE = "compare",
  /** Request for odds calculation */
  ODDS = "odds",
  /** Response with calculation results */
  RESPONSE = "response",
  /** Error message */
  ERROR = "error",
}

/**
 * WebSocket message interface
 */
export interface WebSocketMessage {
  /** Message type */
  type: WebSocketMessageType;
  /** Message ID for correlation */
  id?: string;
  /** Request data */
  data?: any;
  /** Response data */
  result?: any;
  /** Error message */
  error?: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Success status */
  success: boolean;
  /** Data payload */
  data?: T;
  /** Error message */
  error?: string;
  /** Request timestamp */
  timestamp: string;
}
