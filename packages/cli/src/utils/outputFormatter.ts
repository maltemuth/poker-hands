// import { HandInterface } from "@malte.muth/poker-hands";

import { Card, HoleOdds, HandPercentages } from "@malte.muth/poker-hands";
import {
  OddsData,
  PercentagesData,
  CLISuccessResponse,
  CLIErrorResponse,
} from "../types/schemas.js";

/**
 * Format card for display
 */
function formatCard({ value, suit }: Card): string {
  const valueMap: Record<number, string> = {
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "T",
    11: "J",
    12: "Q",
    13: "K",
    14: "A",
  };

  return `${valueMap[value]}${suit}`;
}

/**
 * Format odds calculation result
 */
export function formatOdds(oddsResult: HoleOdds[]): string {
  const player1Win = (oddsResult[0]?.winChance || 0) * 100;
  const player2Win = (oddsResult[1]?.winChance || 0) * 100;
  const tie = (oddsResult[0]?.tieChance || 0) * 100;

  return `Winning Odds:
Player 1: ${player1Win.toFixed(2)}%
Player 2: ${player2Win.toFixed(2)}%
Tie: ${tie.toFixed(2)}%
Total: ${(player1Win + player2Win + tie).toFixed(2)}%`;
}

/**
 * Format percentages calculation result
 */
export function formatPercentages(percentagesResult: HandPercentages): string {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

  // Calculate total percentage for verification
  const total = Object.values(percentagesResult).reduce(
    (sum, item) => sum + item.percentage,
    0
  );

  return `Hand Type Percentages:
High Card: ${formatPercentage(percentagesResult.highCard.percentage)}
Pair: ${formatPercentage(percentagesResult.pair.percentage)}
Two Pair: ${formatPercentage(percentagesResult.twoPair.percentage)}
Three of a Kind: ${formatPercentage(percentagesResult.threeOfAKind.percentage)}
Straight: ${formatPercentage(percentagesResult.straight.percentage)}
Flush: ${formatPercentage(percentagesResult.flush.percentage)}
Full House: ${formatPercentage(percentagesResult.fullHouse.percentage)}
Four of a Kind: ${formatPercentage(percentagesResult.fourOfAKind.percentage)}
Straight Flush: ${formatPercentage(percentagesResult.straightFlush.percentage)}
Royal Flush: ${formatPercentage(percentagesResult.royalFlush.percentage)}
Total: ${(total * 100).toFixed(2)}%`;
}

// Export the outputFormatter object
export const outputFormatter = {
  formatOdds,
  formatPercentages,
  formatResult,
  formatHandType,
  // JSON functions
  formatOddsJson,
  formatPercentagesJson,
  createJsonResponse,
};

/**
 * Generic success/error formatter
 */
export function formatResult(
  success: boolean,
  data?: HandPercentages,
  error?: string
): string {
  if (success) {
    return data
      ? JSON.stringify(data, null, 2)
      : "Operation completed successfully";
  } else {
    return error || "Operation failed";
  }
}

/**
 * Format hand type with count and percentage
 */
export function formatHandType(
  type: string,
  count: number,
  percentage: number
): string {
  const formattedPercentage = `${(percentage * 100).toFixed(2)}%`;
  return `${type}: ${count} occurrences (${formattedPercentage})`;
}

// JSON Output Functions

/**
 * Format odds result for JSON output
 */
export function formatOddsJson(oddsResult: HoleOdds[]): OddsData {
  return {
    players: oddsResult.map((player) => ({
      holeCards: player.hole.map(formatCard),
      winChance: player.winChance,
      tieChance: player.tieChance,
    })),
  };
}

/**
 * Format percentages result for JSON output
 */
export function formatPercentagesJson(
  percentagesResult: HandPercentages
): PercentagesData {
  return {
    highCard: {
      percentage: percentagesResult.highCard.percentage,
      count: percentagesResult.highCard.count,
    },
    pair: {
      percentage: percentagesResult.pair.percentage,
      count: percentagesResult.pair.count,
    },
    twoPair: {
      percentage: percentagesResult.twoPair.percentage,
      count: percentagesResult.twoPair.count,
    },
    threeOfAKind: {
      percentage: percentagesResult.threeOfAKind.percentage,
      count: percentagesResult.threeOfAKind.count,
    },
    straight: {
      percentage: percentagesResult.straight.percentage,
      count: percentagesResult.straight.count,
    },
    flush: {
      percentage: percentagesResult.flush.percentage,
      count: percentagesResult.flush.count,
    },
    fullHouse: {
      percentage: percentagesResult.fullHouse.percentage,
      count: percentagesResult.fullHouse.count,
    },
    fourOfAKind: {
      percentage: percentagesResult.fourOfAKind.percentage,
      count: percentagesResult.fourOfAKind.count,
    },
    straightFlush: {
      percentage: percentagesResult.straightFlush.percentage,
      count: percentagesResult.straightFlush.count,
    },
    royalFlush: {
      percentage: percentagesResult.royalFlush.percentage,
      count: percentagesResult.royalFlush.count,
    },
  };
}

/**
 * Create JSON response object
 */
export function createJsonResponse(
  success: boolean,
  command: string,
  data?: object,
  error?: string
): CLISuccessResponse<object> | CLIErrorResponse {
  if (success) {
    return {
      success: true,
      command,
      data: data!,
    };
  } else {
    return {
      success: false,
      command,
      error: error!,
    };
  }
}
