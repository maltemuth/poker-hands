import { Card, Suit } from "../card/Card";
import { rankOf } from "./rankOf";

/**
 * The rank of the best hand in 5 to 7 cards, as handRank(getBestHand(cards))
 * computes it, but without building the hand: the cards are turned into a
 * bit mask per suit, and rankOf determines the hand from those.
 *
 * @param cards - 5 to 7 distinct cards
 * @returns The rank of the best hand, see handRank
 *
 * @example
 * ```typescript
 * evaluate(cards("Kh", "Kd", "Ks", "9c", "9d", "2s", "4h")); // 0x7ddd99
 * ```
 */
const evaluate = (cards: Card[]): number => {
  // the suit masks in local variables rather than an array, so that
  // evaluating a hand allocates nothing
  let h = 0;
  let d = 0;
  let c = 0;
  let s = 0;
  for (const card of cards) {
    const bit = 1 << card.value;
    if (card.suit === Suit.hearts) h |= bit;
    else if (card.suit === Suit.diamonds) d |= bit;
    else if (card.suit === Suit.clubs) c |= bit;
    else s |= bit;
  }
  return rankOf(h, d, c, s);
};

export default evaluate;
