/**
 * Generates all possible combinations of a given length from an array of items.
 * This is a recursive implementation that creates all subsets of the specified size,
 * disregarding order (i.e., [A, B] is considered the same as [B, A]).
 *
 * The algorithm uses a divide-and-conquer approach:
 * 1. Base cases handle edge scenarios (length 0, 1, or equal to array length)
 * 2. For each element, recursively find combinations of the remaining elements
 * 3. Prepend the current element to each of those combinations
 * 4. Flatten the results into a single array
 *
 * Time complexity: O(nCr) where n is items.length and r is length
 * Space complexity: O(nCr) to store all combinations
 *
 * @template T Type of items in the array
 * @param items Array of items to create combinations from
 * @param length Size of each combination
 * @returns Array of all possible combinations of the specified length
 *
 * @throws {Error} If length is negative or greater than items.length
 *
 * @example
 * // Get all 2-card combinations from a deck
 * const cards = ['Ah', 'Kh', 'Qh', 'Jh'];
 * combinations(cards, 2);
 * // Returns: [['Ah', 'Kh'], ['Ah', 'Qh'], ['Ah', 'Jh'], ['Kh', 'Qh'], ['Kh', 'Jh'], ['Qh', 'Jh']]
 *
 * // Get all 3-card combinations
 * combinations(cards, 3);
 * // Returns: [['Ah', 'Kh', 'Qh'], ['Ah', 'Kh', 'Jh'], ['Ah', 'Qh', 'Jh'], ['Kh', 'Qh', 'Jh']]
 */
const combinations = <T>(items: T[], length: number): T[][] => {
  // Validate input parameters
  if (length > items.length) {
    throw new Error(
      `Cannot pick combinations of length ${length} out of ${items.length} elements`
    );
  }

  if (length < 0) {
    throw new Error("Cannot pick negative amount of elements");
  }

  // Base case: empty combination
  if (length === 0) return [];

  // Base case: combinations of length 1 are just the individual items
  if (length === 1) return items.map((item) => [item]);

  // Base case: one combination containing all items
  if (length === items.length) return [items];

  // Recursive case: for each item, combine it with combinations of smaller length
  return items
    .map((value, index, list): T[][] => {
      // Skip if there aren't enough items left to form a combination
      if (list.length - index < length) return [];

      // Get all combinations of the remaining items with reduced length
      const subCombinationsAfterThisIndex = combinations(
        list.slice(index + 1), // Exclude current item and all previous items
        length - 1 // Reduce combination size by 1
      );

      // Prepend current item to each sub-combination
      return subCombinationsAfterThisIndex.map((subCombination) => [
        value,
        ...subCombination,
      ]);
    })
    .reduce((flat, list) => flat.concat(list)); // Flatten all combinations into single array
};

export default combinations;
