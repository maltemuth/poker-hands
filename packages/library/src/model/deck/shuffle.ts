/**
 * Randomly shuffles an array using the Fisher-Yates algorithm.
 *
 * This function takes an array and returns a new array with the elements
 * in random order. The original array is not modified. The shuffling
 * algorithm used is the Fisher-Yates (also known as Knuth) shuffle,
 * which provides a uniformly random permutation of the input array.
 * The randomness is Math.random's, which is not cryptographically secure.
 *
 * @param items - The array to shuffle
 * @returns A new array with elements in random order
 *
 * @example
 * ```typescript
 * import shuffle from './shuffle.js';
 *
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffle(numbers);
 * console.log(shuffled); // e.g., [3, 1, 5, 2, 4]
 *
 * // Original array remains unchanged
 * console.log(numbers); // [1, 2, 3, 4, 5]
 * ```
 *
 * @example
 * ```typescript
 * import create from './create.js';
 * import shuffle from './shuffle.js';
 *
 * // Create and shuffle a deck of cards
 * const deck = create();
 * const shuffledDeck = shuffle(deck);
 * ```
 */
const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    // any of the first i + 1 items, including the one at i
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export default shuffle;
