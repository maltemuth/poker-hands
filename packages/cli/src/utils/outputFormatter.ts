// import { HandInterface } from "@malte.muth/poker-hands";

import {
  Card,
  HandType,
  HandInterface,
  HoleOdds,
  HandPercentages,
} from "@malte.muth/poker-hands";

/**
 * Convert hand type to string
 */
function handTypeToString(type: HandType): string {
  const typeNames: Record<number, string> = {
    1: "High Card",
    2: "Pair",
    3: "Two Pair",
    4: "Three of a Kind",
    5: "Straight",
    6: "Flush",
    7: "Full House",
    8: "Four of a Kind",
    9: "Straight Flush",
    10: "Royal Flush",
  };
  return typeNames[type] || "Unknown";
}

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
 * Format the best hand result for display
 */
export function formatBestHand(hand: HandInterface, allCards: Card[]): string {
  const handType = handTypeToString(hand.type);
  const allCardsStr = allCards.map(formatCard).join(", ");

  // Check if hand.value is a function or a value
  const rank = typeof hand.value === "function" ? hand.value() : hand.value;

  return `Best Hand: ${handType}
Cards: ${allCardsStr}
Rank: ${rank}`;
}

/**
 * Format comparison result between two hands
 */
export function compareHands(
  hand1: Card[],
  hand2: Card[],
  result: boolean | null
): string {
  const hand1Str = hand1.map(formatCard).join(", ");
  const hand2Str = hand2.map(formatCard).join(", ");

  if (result === true) {
    return `Hand 1: ${hand1Str}
Hand 2: ${hand2Str}
Result: Hand 1 is better than Hand 2`;
  } else if (result === false) {
    return `Hand 1: ${hand1Str}
Hand 2: ${hand2Str}
Result: Hand 1 is worse than Hand 2`;
  } else {
    return `Hand 1: ${hand1Str}
Hand 2: ${hand2Str}
Result: Both hands are equal`;
  }
}

/**
 * Format odds calculation result
 */
export function formatOdds(oddsResult: HoleOdds[]): string {
  const player1Win = (oddsResult[0]?.winChance || 0) * 100;
  const player2Win = (oddsResult[1]?.winChance || 0) * 100;
  const tie = (oddsResult[0]?.tieChance || 0) * 100;

  // Add confidence intervals if available (Monte Carlo results)
  let confidenceInfo = "";
  if (oddsResult[0]?.winChanceError) {
    confidenceInfo = `
Note: Results based on Monte Carlo simulation with ±${(
      oddsResult[0].winChanceError * 100
    ).toFixed(1)}% confidence interval`;
  }

  return `Winning Odds:
Player 1: ${player1Win.toFixed(2)}%
Player 2: ${player2Win.toFixed(2)}%
Tie: ${tie.toFixed(2)}%
Total: ${(player1Win + player2Win + tie).toFixed(2)}%${confidenceInfo}`;
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
  formatBestHand,
  compareHands,
  formatOdds,
  formatPercentages,
  formatResult,
  formatHandType,
  // JSON functions
  formatOddsJson,
  formatBestHandJson,
  formatPercentagesJson,
  formatCompareJson,
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
export function formatOddsJson(oddsResult: HoleOdds[]): object {
  return {
    players: oddsResult.map((player) => ({
      holeCards: player.hole.map(formatCard),
      winChance: player.winChance,
      tieChance: player.tieChance,
      ...(player.winChanceError && { winChanceError: player.winChanceError }),
    })),
  };
}

/**
 * Format best hand result for JSON output
 */
export function formatBestHandJson(
  hand: HandInterface,
  allCards: Card[]
): object {
  const rank = typeof hand.value === "function" ? hand.value() : hand.value;

  return {
    hand: {
      type: handTypeToString(hand.type),
      value: rank,
      cards: hand.cards().map(formatCard),
    },
    allCards: allCards.map(formatCard),
  };
}

/**
 * Format percentages result for JSON output
 */
export function formatPercentagesJson(
  percentagesResult: HandPercentages
): object {
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
 * Format compare result for JSON output
 */
export function formatCompareJson(
  hand1Cards: Card[],
  hand2Cards: Card[],
  bestHand1: HandInterface | null,
  bestHand2: HandInterface | null,
  result: boolean | null
): object {
  return {
    hand1: {
      cards: hand1Cards.map(formatCard),
      bestHand: bestHand1
        ? {
            type: handTypeToString(bestHand1.type),
            value:
              typeof bestHand1.value === "function"
                ? bestHand1.value()
                : bestHand1.value,
          }
        : null,
    },
    hand2: {
      cards: hand2Cards.map(formatCard),
      bestHand: bestHand2
        ? {
            type: handTypeToString(bestHand2.type),
            value:
              typeof bestHand2.value === "function"
                ? bestHand2.value()
                : bestHand2.value,
          }
        : null,
    },
    result,
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
): object {
  return {
    success,
    command,
    ...(data && { data }),
    ...(error && { error }),
  };
}
