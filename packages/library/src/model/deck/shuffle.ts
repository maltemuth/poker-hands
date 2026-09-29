/**
 * Randomly shuffles an array using the Fisher-Yates algorithm.
 *
 * This function takes an array and returns a new array with the elements
 * in random order. The original array is not modified. The shuffling
 * algorithm used is the Fisher-Yates (also known as Knuth) shuffle,
 * which provides a uniformly random permutation of the input array.
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
 *
 * // Each shuffle produces a different order
 * const anotherShuffle = shuffle(deck);
 * console.log(shuffledDeck !== anotherShuffle); // true
 * ```
 */
const shuffle = <T>(items: T[]): T[] => {
  const remainingItems = items.concat();
  const result: T[] = [];
  for (let i = items.length - 1; i >= 0; i--) {
    // any of the i + 1 remaining items, including the last one
    const randomIndex = Math.floor(Math.random() * (i + 1));

    result.push(remainingItems[randomIndex]);
    remainingItems.splice(randomIndex, 1);
  }

  return result;
};

export default shuffle;
