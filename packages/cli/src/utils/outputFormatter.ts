import { HoleOdds, HandPercentages } from "@malte.muth/poker-hands";

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
  formatHandType,
};

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
