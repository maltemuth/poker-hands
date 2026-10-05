import { Card, Value } from "../card/Card.js";
import assertUnique from "../card/assertUnique.js";
import { HandInterface, HandType } from "./Hand.js";
import evaluate from "./evaluate.js";

/**
 * How many of the five cards make each hand type; the rest are kickers
 */
const madeCards: Record<HandType, number> = {
  [HandType.HighCard]: 1,
  [HandType.Pair]: 2,
  [HandType.TwoPair]: 4,
  [HandType.ThreeOfAKind]: 3,
  [HandType.Straight]: 5,
  [HandType.Flush]: 5,
  [HandType.FullHouse]: 5,
  [HandType.FourOfAKind]: 4,
  [HandType.StraightFlush]: 5,
  [HandType.RoyalFlush]: 5,
};

const isFlush = (type: HandType): boolean =>
  type === HandType.Flush ||
  type === HandType.StraightFlush ||
  type === HandType.RoyalFlush;

/**
 * Determines the best poker hand in up to seven cards: its type, the cards
 * that make it, most important first (e.g. the trips, then the pair of a
 * full house), and the kickers that complete the best five, highest first.
 *
 * The hand is read from its rank (see evaluate and handRank): the rank names
 * the five values that play, and each is taken from the first card of that
 * value, of the flush suit for flushes. Fewer than five cards make a hand of
 * fewer cards, e.g. a pair without kickers.
 *
 * @param cards - Up to seven distinct cards
 * @throws {Error} If there are more than seven cards, or a card appears twice
 *
 * @example
 * ```typescript
 * const hand = getBestHand(cards("Kh", "Kd", "9c", "Ks", "9d", "2s", "4h"));
 * hand.type; // HandType.FullHouse
 * hand.cards().map(toString); // ["Kh", "Kd", "Ks", "9c", "9d"]
 * ```
 */
const getBestHand = (cards: Card[]): HandInterface => {
  if (cards.length > 7) throw new Error("At most 7 cards can be ranked");
  assertUnique(cards);

  const rank = evaluate(cards);
  const type: HandType = rank >> 20;
  const flushSuit = isFlush(type)
    ? cards.find(
        ({ suit }) => cards.filter((card) => card.suit === suit).length >= 5
      )?.suit
    : undefined;

  // the rank's five values, one hex digit each; 0 when there are fewer cards
  const best: Card[] = [];
  for (let shift = 16; shift >= 0; shift -= 4) {
    const digit = (rank >> shift) & 0xf;
    if (!digit) break;
    // in a wheel (5-4-3-2-A) the ace counts as 1
    const value = digit === 1 ? Value.ace : digit;
    const card = cards.find(
      (card) =>
        card.value === value &&
        (flushSuit === undefined || card.suit === flushSuit) &&
        !best.includes(card)
    );
    // the rank only names values of the cards, so there always is one
    if (card) best.push(card);
  }

  const made = best.slice(0, madeCards[type]);
  const kickers = best.slice(madeCards[type]);
  return { type, cards: () => made, kickers: () => kickers };
};

export default getBestHand;
