import { Value, Card } from "../../card/Card";
import hasContiguousSubSetsOfLength5 from "../../card/hasContiguousSubSetsOfLength5";
import hasFlush from "./hasFlush";
import hasStraight from "./hasStraight";
import sortedValues from "../../card/sortedValues";
import sortedSuits from "../../card/sortedSuits";

/**
 * Detects if a straight flush (5 consecutive cards of the same suit) exists within the given cards.
 *
 * A straight flush is defined as 5 cards with consecutive values, all of the same suit.
 * This function handles both regular straight flushes (e.g., 5-6-7-8-9 of hearts) and
 * special cases like royal flushes (A-K-Q-J-10) and Ace-low straight flushes (A-2-3-4-5).
 *
 * @param cards - Array of playing cards to analyze for straight flushes
 * @param presortedValues - Optional pre-sorted array of card values for optimization.
 *                         If not provided, will be calculated from the cards array.
 *                         Default: sortedValues(cards)
 * @param presortedSuits - Optional pre-sorted array of suits for optimization.
 *                        If not provided, will be calculated from the cards array.
 *                        Default: sortedSuits(cards)
 * @param alreadyHasFlush - Optional pre-computed flush detection result for optimization.
 *                         If not provided, will be calculated using hasFlush().
 *                         Default: hasFlush(cards, presortedSuits)
 * @param alreadyHasStraight - Optional pre-computed straight detection result for optimization.
 *                            If not provided, will be calculated using hasStraight().
 *                            Default: hasStraight(cards, presortedValues)
 * @returns `true` if a straight flush is found, `false` otherwise
 *
 * @example
 * // Regular straight flush
 * const cards1 = cards("5h", "6h", "7h", "8h", "9h");
 * hasStraightFlush(cards1); // true
 *
 * @example
 * // Royal flush
 * const cards2 = cards("Th", "Jh", "Qh", "Kh", "Ah");
 * hasStraightFlush(cards2); // true
 *
 * @example
 * // Ace-low straight flush
 * const cards3 = cards("Ah", "2h", "3h", "4h", "5h");
 * hasStraightFlush(cards3); // true
 *
 * @example
 * // Flush but not straight
 * const cards4 = cards("2h", "5h", "7h", "9h", "Jh");
 * hasStraightFlush(cards4); // false
 *
 * @example
 * // Straight but not flush
 * const cards5 = cards("5h", "6d", "7c", "8s", "9h");
 * hasStraightFlush(cards5); // false
 *
 * @remarks
 * - Time Complexity: O(n) when pre-computed values are provided, O(n log n) otherwise
 * - Space Complexity: O(n) for storing suit-grouped values
 * - Automatically handles royal flushes (A-K-Q-J-10) as a type of straight flush
 * - Only checks suits with 5+ cards for straight potential
 * - Uses pre-computed results when provided for better performance
 */
const hasStraightFlush = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  presortedSuits = sortedSuits(cards),
  alreadyHasFlush = hasFlush(cards, presortedSuits),
  alreadyHasStraight = hasStraight(cards, presortedValues)
) => {
  if (!alreadyHasFlush) return false;
  if (!alreadyHasStraight) return false;

  /**
   * an object with suits as keys where the corresponing value is the list of values of that suit in cards
   */
  const valuesBySuit: { [suit: string]: Value[] } = cards.reduce(
    (dict, card) => {
      const { suit, value } = card;

      dict[suit] = dict[suit] || [];
      dict[suit].push(value);

      return dict;
    },
    {}
  );

  // only if any flushes remain, we need to calculate further
  const candidates = (Object.values(valuesBySuit) as Value[][]).filter(
    (list) => list.length >= 5
  );

  if (candidates.length === 0) return false;

  const flushCandidate = candidates[0];

  if (hasContiguousSubSetsOfLength5(flushCandidate)) return true;

  // and a list of straight flushes starting with an ace for each remaining suit
  const candidateValuesWithAceReplaced = flushCandidate.map((value) =>
    value === Value.ace ? 1 : value
  );

  if (hasContiguousSubSetsOfLength5(candidateValuesWithAceReplaced))
    return true;

  return false;
};

export default hasStraightFlush;
