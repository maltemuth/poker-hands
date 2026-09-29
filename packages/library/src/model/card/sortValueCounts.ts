import { Card } from "./Card.js";
import valueCounts from "./valueCounts.js";
import numericalSort from "../../lib/numericalSort.js";

/**
 * Gets the frequency counts of card values and sorts them in descending order.
 * This is useful for determining hand patterns like pairs, three of a kind, etc.
 *
 * The algorithm works by:
 * 1. Counting how many times each card value appears in the hand
 * 2. Extracting just the frequency counts (not the values themselves)
 * 3. Sorting the frequencies from lowest to highest
 * 4. Reversing to get highest to lowest order
 *
 * For example, a hand with [A, A, K, K, K, Q, Q] would return [3, 2, 2]
 * indicating one value appears 3 times and two values appear 2 times each.
 *
 * @param cards Array of cards to analyze
 * @returns Array of frequency counts sorted from highest to lowest
 *
 * @example
 * // Analyze a full house
 * const fullHouse = [
 *   { suit: 'hearts', value: 14 }, // Ace
 *   { suit: 'spades', value: 14 }, // Ace
 *   { suit: 'diamonds', value: 14 }, // Ace
 *   { suit: 'clubs', value: 13 }, // King
 *   { suit: 'hearts', value: 13 } // King
 * ];
 *
 * sortValueCounts(fullHouse); // [3, 2] (three Aces, two Kings)
 *
 * // Analyze a pair
 * const pair = [
 *   { suit: 'hearts', value: 14 }, // Ace
 *   { suit: 'spades', value: 14 }, // Ace
 *   { suit: 'diamonds', value: 13 }, // King
 *   { suit: 'clubs', value: 12 }, // Queen
 *   { suit: 'hearts', value: 11 } // Jack
 * ];
 *
 * sortValueCounts(pair); // [2, 1, 1, 1] (one pair, three singletons)
 */
const sortValueCounts = (cards: Card[]): number[] =>
  // Get frequency counts of each value, sort them, and reverse for descending order
  Object.values(valueCounts(cards)).sort(numericalSort).reverse();

export default sortValueCounts;
