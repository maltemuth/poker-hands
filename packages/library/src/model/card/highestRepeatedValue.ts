import { Value, Card } from "./Card";
import valueCounts from "./valueCounts";

/**
 * Finds the highest card value that appears at least the specified number of times.
 * This is used to detect pairs, three of a kind, four of a kind, etc.
 *
 * The algorithm works by:
 * 1. Counting occurrences of each card value (or using pre-calculated counts)
 * 2. Filtering values that meet or exceed the repetition threshold
 * 3. Sorting the qualifying values in descending order
 * 4. Returning the highest value that meets the criteria
 *
 * @param cards Array of cards to analyze
 * @param repetitionCount Minimum number of times a value must appear to qualify
 * @param precalculatedValueCounts Optional pre-calculated value counts for optimization
 * @returns The highest value that appears at least repetitionCount times, or null if none found
 *
 * @example
 * // Find the highest pair in a hand
 * const cards = [
 *   { suit: 'hearts', value: 14 }, // Ace
 *   { suit: 'spades', value: 14 }, // Ace
 *   { suit: 'diamonds', value: 13 }, // King
 *   { suit: 'clubs', value: 7 }, // 7
 *   { suit: 'hearts', value: 2 } // 2
 * ];
 *
 * highestRepeatedValue(cards, 2); // 14 (Ace is the highest pair)
 *
 * // Find three of a kind
 * highestRepeatedValue(cards, 3); // null (no three of a kind)
 */
const highestRepeatedValue = (
  cards: Card[],
  repetitionCount: number,
  precalculatedValueCounts = valueCounts(cards)
): Value | null => {
  // Get all values that appear at least the specified number of times
  const repeatedValues = Object.keys(precalculatedValueCounts)
    .filter(
      (key) =>
        // Check if this value appears enough times
        precalculatedValueCounts[key as unknown as Value] >= repetitionCount
    )
    .map((value) => parseInt(value, 10)) // Convert string keys back to numbers
    .sort((a, b) => b - a); // Sort from highest to lowest

  // Return the highest value that meets the criteria, or null if none found
  return repeatedValues[0] || null;
};

export default highestRepeatedValue;
