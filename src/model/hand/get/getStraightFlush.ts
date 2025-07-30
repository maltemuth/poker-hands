import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import getStraight from "./getStraight";
import purify from "../../../lib/purify";

/**
 * Extracts the highest straight flush from the given cards and returns hand metadata.
 *
 * This function analyzes the provided cards to find the best possible straight flush
 * (5 consecutive cards of the same suit) and returns a structured hand object containing
 * the straight flush cards and associated metadata. It handles both regular straight flushes,
 * royal flushes (A-K-Q-J-10), and Ace-low straight flushes (A-2-3-4-5).
 *
 * @param cards - Array of playing cards to analyze for straight flushes
 * @returns Hand<HandType.StraightFlush> object containing hand metadata if straight flush found,
 *          or null if no straight flush is found
 *
 * The returned Hand object has the following structure:
 * ```typescript
 * {
 *   type: HandType.StraightFlush,
 *   cards: () => Card[],      // The 5 cards that form the straight flush
 *   value: () => Value,       // The highest value in the straight flush
 *   subvalue: () => null,     // No subvalue for straight flushes
 *   kickers: () => Card[]     // Empty array for straight flushes
 * }
 * ```
 *
 * @example
 * // Regular straight flush
 * const cards1 = cards("5h", "6h", "7h", "8h", "9h", "Th", "Jh");
 * const straightFlush1 = getStraightFlush(cards1);
 * straightFlush1.cards(); // [9h, Th, Jh, 8h, 7h] (highest possible)
 * straightFlush1.value(); // Value.Jack
 *
 * @example
 * // Royal flush
 * const cards2 = cards("Th", "Jh", "Qh", "Kh", "Ah");
 * const royalFlush = getStraightFlush(cards2);
 * royalFlush.cards(); // [Ah, Kh, Qh, Jh, Th]
 * royalFlush.value(); // Value.Ace
 *
 * @example
 * // Ace-low straight flush
 * const cards3 = cards("Ah", "2h", "3h", "4h", "5h");
 * const aceLowFlush = getStraightFlush(cards3);
 * aceLowFlush.cards(); // [5h, 4h, 3h, 2h, Ah]
 * aceLowFlush.value(); // Value.Ace
 *
 * @example
 * // No straight flush
 * const cards4 = cards("5h", "6d", "7c", "8s", "9h");
 * const straightFlush4 = getStraightFlush(cards4); // null
 *
 * @remarks
 * - Time Complexity: O(n log n) for sorting and analysis
 * - Space Complexity: O(n) for suit-grouped arrays
 * - Returns the highest possible straight flush when multiple exist
 * - Correctly identifies royal flushes (A-K-Q-J-10) as a type of straight flush
 * - Properly handles Ace-low straight flushes (A-2-3-4-5)
 * - Only checks suits with 5+ cards for straight flush potential
 * - Works with 5, 6, or 7 card hands to find the best 5-card straight flush
 */
const getStraightFlush = (
  cards: Card[]
): Hand<HandType.StraightFlush> | null => {
  const straight = purify(() => {
    const cardsBySuit: { [suit: string]: Card[] } = cards.reduce(
      (bySuit, card) => {
        bySuit[card.suit] = bySuit[card.suit] || [];
        bySuit[card.suit].push(card);

        return bySuit;
      },
      {}
    );

    const flushCandidate = Object.values(cardsBySuit).filter(
      (candidate) => candidate.length >= 5
    )[0];

    return getStraight(flushCandidate);
  });

  return {
    type: HandType.StraightFlush,
    cards: purify(() => straight().cards()),
    value: purify(() => straight().value()),
    kickers: () => [],
    subvalue: () => null,
  };
};

export default getStraightFlush;
