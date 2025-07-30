import { Value, Card } from "../../card/Card";
import hasContiguousSubSetsOfLength5 from "../../card/hasContiguousSubSetsOfLength5";
import sortedValues from "../../card/sortedValues";

/**
 * Detects if a straight (5 consecutive cards) exists within the given cards.
 *
 * A straight is defined as 5 cards with consecutive values. The function handles
 * both regular straights (e.g., 5-6-7-8-9) and Ace-low straights (A-2-3-4-5)
 * by treating Ace as value 1 in the latter case.
 *
 * @param cards - Array of playing cards to analyze for straights
 * @param presortedValues - Optional pre-sorted array of card values for optimization.
 *                         If not provided, will be calculated from the cards array.
 *                         Default: sortedValues(cards)
 * @returns `true` if a straight is found, `false` otherwise
 *
 * @example
 * // Regular straight
 * const cards1 = cards("5h", "6d", "7c", "8s", "9h");
 * hasStraight(cards1); // true
 *
 * @example
 * // Ace-low straight (A-2-3-4-5)
 * const cards2 = cards("Ah", "2d", "3c", "4s", "5h");
 * hasStraight(cards2); // true
 *
 * @example
 * // No straight
 * const cards3 = cards("2h", "4d", "6c", "8s", "Th");
 * hasStraight(cards3); // false
 *
 * @example
 * // With duplicates
 * const cards4 = cards("5h", "5d", "6c", "7s", "8h", "9d");
 * hasStraight(cards4); // true (ignores duplicate 5)
 *
 * @remarks
 * - Time Complexity: O(n log n) due to sorting (when presortedValues not provided)
 * - Space Complexity: O(n) for storing unique values
 * - Automatically filters duplicate card values
 * - Handles Ace as both high (14) and low (1) value
 */
const hasStraight = (
  cards: Card[],
  presortedValues = sortedValues(cards)
): boolean => {
  const values = presortedValues.filter(
    (value, index, list) => list.indexOf(value) === index
  );

  // straights can also start with an ace, which is the same as counting an ace as 1
  const valuesWithAceAsOne = values.map((value) =>
    value === Value.ace ? 1 : value
  );

  return (
    hasContiguousSubSetsOfLength5(values, presortedValues) ||
    hasContiguousSubSetsOfLength5(valuesWithAceAsOne)
  );
};

export default hasStraight;
