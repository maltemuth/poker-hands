import { Card } from "../card/Card";
import {
  SUIT_INDEX,
  clearHandState,
  createHandState,
  addCard,
  rankOf,
} from "./handState";

// reused by every call, so that evaluating a hand allocates nothing
const state = createHandState();

/**
 * The rank of the best hand in 5 to 7 cards, as handRank(getBestHand(cards))
 * computes it, but without building the hand: the cards are read into a
 * HandState, and rankOf determines the hand from it.
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
  clearHandState(state);
  for (const card of cards) addCard(state, SUIT_INDEX[card.suit], card.value);
  return rankOf(state);
};

export default evaluate;
