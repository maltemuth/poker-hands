import { Card, Value } from "./Card";

/**
 * Extracts and sorts card values in descending order
 * @param set Array of cards to extract values from
 * @returns Array of values sorted from highest to lowest
 */
const sortedValues = (set: Card[]): Value[] =>
  set.map(({ value }) => value).sort((x, y) => y - x);

/**
 * Compares two sets of cards to determine if the first set has better values than the second.
 * This is used for comparing poker hands by comparing their highest values first.
 *
 * The comparison works by:
 * 1. Sorting both sets of values in descending order
 * 2. Comparing values at each position from highest to lowest
 * 3. Returning true as soon as a higher value is found in the first set
 *
 * @param a First set of cards to compare
 * @param b Second set of cards to compare
 * @returns True if set a has better values than set b, false otherwise
 *
 * @example
 * // Compare two poker hands
 * const handA = [{ suit: 'hearts', value: 14 }, { suit: 'spades', value: 13 }]; // A, K
 * const handB = [{ suit: 'diamonds', value: 14 }, { suit: 'clubs', value: 12 }]; // A, Q
 *
 * hasBetterValues(handA, handB); // false (both have A, but K > Q)
 */
const hasBetterValues = (a: Card[], b: Card[]) => {
  // Get sorted values for both sets (highest to lowest)
  const aValues = sortedValues(a);
  const bValues = sortedValues(b);

  // Compare values position by position from highest to lowest
  // Return true as soon as we find a higher value in the first set
  return aValues.reduce(
    (better, value, index) => better || value > bValues[index],
    false
  );
};

export default hasBetterValues;
