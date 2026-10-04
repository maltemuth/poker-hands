import { HoleOdds, HandPercentages, toString } from "@malte.muth/poker-hands";

const percent = (chance: number) => `${(chance * 100).toFixed(2)}%`;

/**
 * Format odds calculation result: one line per player, in the order of the
 * holes. Each player has their own tie chance, since in a multi-way pot a
 * player can tie with some opponents while others lose.
 */
export function formatOdds(oddsResult: HoleOdds[]): string {
  const players = oddsResult.map(
    (player, index) =>
      `Player ${index + 1} (${player.hole.map(toString).join("")}): ` +
      `${percent(player.winChance)} win, ${percent(player.tieChance)} tie`
  );
  return ["Winning Odds:", ...players].join("\n");
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
};
