// import { HandInterface } from "@malte.muth/poker-hands";

/**
 * Convert hand type to readable string
 */
function handTypeToString(type: number): string {
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
function formatCard(card: any): string {
  // Handle both function and value cases
  const value = typeof card.value === "function" ? card.value() : card.value;
  const suit = typeof card.suit === "function" ? card.suit() : card.suit;

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
export function formatBestHand(hand: any, allCards: any[]): string {
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
  hand1: any[],
  hand2: any[],
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
export function formatOdds(oddsResult: any): string {
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
export function formatPercentages(percentagesResult: any): string {
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

  // Calculate total percentage for verification
  const total = Object.values(percentagesResult).reduce(
    (sum: number, item: any) => sum + item.percentage,
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
};

/**
 * Generic success/error formatter
 */
export function formatResult(
  success: boolean,
  data?: any,
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
