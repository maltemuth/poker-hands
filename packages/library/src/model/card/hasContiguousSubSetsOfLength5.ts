import numericalSort from "../../lib/numericalSort.js";
import { Value } from "./Card.js";

/**
 * Detects if there's a straight (5 contiguous values) in the given set of values.
 * This is used to identify straight poker hands.
 *
 * The algorithm works by:
 * 1. Starting with each value in the sorted list
 * 2. Checking if the next 4 values are exactly 1, 2, 3, and 4 greater than the current value
 * 3. If any starting value satisfies this condition, we have a straight
 *
 * Note: This handles regular straights but not special cases like Ace-low straights (A-2-3-4-5)
 * which would need special handling elsewhere.
 *
 * @param values Array of card values to check for straights
 * @param presortedValues Optional pre-sorted values to avoid re-sorting (optimization)
 * @returns True if there's a straight of length 5, false otherwise
 *
 * @example
 * // Check for a straight
 * const values = [2, 3, 4, 5, 6, 7, 8];
 * hasContiguousSubSetsOfLength5(values); // true (2-3-4-5-6 or 3-4-5-6-7 or 4-5-6-7-8)
 *
 * // Check for no straight
 * const values = [2, 4, 6, 8, 10];
 * hasContiguousSubSetsOfLength5(values); // false
 */
const hasContiguousSubSetsOfLength5 = (
  values: number[],
  presortedValues: Value[] = values.sort(numericalSort)
): boolean =>
  // For each value in the sorted list, check if it can be the start of a 5-card straight
  presortedValues.some((value, index, list) =>
    // Check if the next 4 values are exactly 1, 2, 3, and 4 greater than current value
    [1, 2, 3, 4].every((shift) => list[index + shift] === value + shift)
  );

export default hasContiguousSubSetsOfLength5;
