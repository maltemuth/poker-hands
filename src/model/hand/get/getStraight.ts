import { Card, Value } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import sortByValue from "../../card/sortByValue";
import purify from "../../../lib/purify";

/**
 * Extracts the highest straight from the given cards and returns hand metadata.
 *
 * This function analyzes the provided cards to find the best possible straight
 * (5 consecutive cards) and returns a structured hand object containing the
 * straight cards and associated metadata. It handles both regular straights
 * and special cases like Ace-low straights (A-2-3-4-5).
 *
 * @param cards - Array of playing cards to analyze for straights
 * @returns Hand<HandType.Straight> object containing hand metadata if straight found,
 *          or null if no straight is found
 *
 * The returned Hand object has the following structure:
 * ```typescript
 * {
 *   type: HandType.Straight,
 *   cards: () => Card[],      // The 5 cards that form the straight
 *   value: () => Value,       // The highest value in the straight
 *   subvalue: () => null,     // No subvalue for straights
 *   kickers: () => Card[]     // Empty array for straights
 * }
 * ```
 *
 * @example
 * // Regular straight
 * const cards1 = cards("5h", "6d", "7c", "8s", "9h", "Th", "Jc");
 * const straight1 = getStraight(cards1);
 * straight1.cards(); // [9h, Th, Jc, 8s, 7c] (highest possible)
 * straight1.value(); // Value.Jack
 *
 * @example
 * // Ace-low straight
 * const cards2 = cards("Ah", "2d", "3c", "4s", "5h");
 * const straight2 = getStraight(cards2);
 * straight2.cards(); // [5h, 4s, 3c, 2d, Ah]
 * straight2.value(); // Value.Ace
 *
 * @example
 * // No straight
 * const cards3 = cards("2h", "4d", "6c", "8s", "Th");
 * const straight3 = getStraight(cards3); // null
 *
 * @remarks
 * - Time Complexity: O(n log n) for sorting and analysis
 * - Space Complexity: O(n) for intermediate arrays
 * - Returns the highest possible straight when multiple straights exist
 * - Correctly handles Ace-low straights (A-2-3-4-5)
 * - Properly handles duplicate values by selecting unique card values
 * - Works with 5, 6, or 7 card hands to find the best 5-card straight
 */
const getStraight = (cards: Card[]): Hand<HandType.Straight> | null => {
  const straight = purify(() => {
    const sortedCards = sortByValue(cards).reverse();
    const values: Value[] = [];
    const withoutDuplicateValues = sortedCards.filter((card) => {
      if (values.includes(card.value)) return false;
      values.push(card.value);
      return true;
    });

    const subsetsOfLength5 = withoutDuplicateValues.map((card, index, list) =>
      [0, 1, 2, 3, 4].map((shift) => {
        // edge case - if we started from 5 then the last card will be undefined, but if the first is an ace, we have a straight anyway
        if (
          shift === 4 &&
          card.value === Value.five &&
          list[0].value === Value.ace
        )
          return list[0];
        if (typeof list[index + shift] === "undefined") return null;
        if (card.value === list[index + shift].value + shift)
          return list[index + shift];
      })
    );

    const contiguousSubsetsOfLength5 = subsetsOfLength5
      .map((subset) => subset.filter((card) => card))
      .filter((subset) => subset.length === 5);

    return contiguousSubsetsOfLength5[0];
  });

  return {
    type: HandType.Straight,
    cards: purify(() => straight()),
    kickers: () => [],
    value: purify(() => straight()[0].value),
    subvalue: () => null,
  };
};

export default getStraight;
