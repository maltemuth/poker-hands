import { Card, Suit, Value } from "../card/Card";
import { HandType } from "./Hand";

const SUIT_INDEX: Record<Suit, number> = {
  [Suit.hearts]: 0,
  [Suit.diamonds]: 1,
  [Suit.clubs]: 2,
  [Suit.spades]: 3,
};

// Reused by every call, so that evaluating a hand allocates nothing.
// Bit v of a suit mask is set if the suit has a card of value v.
const suitMasks = new Uint16Array(4);
// how many cards of each value (index 2-14) there are
const counts = new Uint8Array(15);

const bit = (value: number): number => 1 << value;

const bitCount = (mask: number): number => {
  let count = 0;
  for (; mask; count++) mask &= mask - 1;
  return count;
};

/**
 * The top card of the highest straight in a mask of values, or 0 if there is
 * none. The ace also counts as 1, for the wheel A-2-3-4-5.
 */
const straightTop = (mask: number): number => {
  const withLowAce = mask & bit(Value.ace) ? mask | bit(1) : mask;
  for (let top: number = Value.ace; top >= Value.five; top--) {
    const run = 0b11111 << (top - 4);
    if ((withLowAce & run) === run) return top;
  }
  return 0;
};

/**
 * Appends a value to a rank `times` times, one hex digit each
 */
const withValue = (rank: number, value: number, times: number): number => {
  for (let i = 0; i < times; i++) rank = (rank << 4) | value;
  return rank;
};

/**
 * Appends the `count` highest values of a mask to a rank
 */
const withHighest = (rank: number, mask: number, count: number): number => {
  for (
    let value: number = Value.ace;
    count > 0 && value >= Value.two;
    value--
  ) {
    if (mask & bit(value)) {
      rank = (rank << 4) | value;
      count--;
    }
  }
  return rank;
};

const straightRank = (type: HandType, top: number): number => {
  let rank: number = type;
  for (let value = top; value > top - 5; value--) rank = (rank << 4) | value;
  return rank;
};

/**
 * The rank of the best hand in 5 to 7 cards, as handRank(getBestHand(cards))
 * computes it, but without building the hand: the cards are read once into
 * a bit mask per suit and a count per value, and the hand is determined from
 * those.
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
  suitMasks.fill(0);
  counts.fill(0);
  let all = 0;
  for (const card of cards) {
    suitMasks[SUIT_INDEX[card.suit]] |= bit(card.value);
    all |= bit(card.value);
    counts[card.value]++;
  }

  // with at most 7 cards, only one suit can have five
  let flush = 0;
  for (const mask of suitMasks) if (bitCount(mask) >= 5) flush = mask;

  if (flush) {
    const top = straightTop(flush);
    if (top === Value.ace) return straightRank(HandType.RoyalFlush, top);
    if (top) return straightRank(HandType.StraightFlush, top);
  }

  // the highest (and second highest) value of each count
  let quads = 0;
  let trips = 0;
  let lowerTrips = 0;
  let pair = 0;
  let lowerPair = 0;
  for (let value: number = Value.ace; value >= Value.two; value--) {
    const count = counts[value];
    if (count === 4) quads = value;
    else if (count === 3) {
      if (trips) lowerTrips ||= value;
      else trips = value;
    } else if (count === 2) {
      if (pair) lowerPair ||= value;
      else pair = value;
    }
  }

  if (quads) {
    const rank = withValue(HandType.FourOfAKind, quads, 4);
    return withHighest(rank, all & ~bit(quads), 1);
  }
  if (trips && (lowerTrips || pair)) {
    const rank = withValue(HandType.FullHouse, trips, 3);
    return withValue(rank, Math.max(lowerTrips, pair), 2);
  }
  if (flush) return withHighest(HandType.Flush, flush, 5);

  const top = straightTop(all);
  if (top) return straightRank(HandType.Straight, top);

  if (trips) {
    const rank = withValue(HandType.ThreeOfAKind, trips, 3);
    return withHighest(rank, all & ~bit(trips), 2);
  }
  if (pair && lowerPair) {
    const rank = withValue(withValue(HandType.TwoPair, pair, 2), lowerPair, 2);
    // a third pair can be the kicker
    return withHighest(rank, all & ~bit(pair) & ~bit(lowerPair), 1);
  }
  if (pair) {
    const rank = withValue(HandType.Pair, pair, 2);
    return withHighest(rank, all & ~bit(pair), 3);
  }
  return withHighest(HandType.HighCard, all, 5);
};

export default evaluate;
