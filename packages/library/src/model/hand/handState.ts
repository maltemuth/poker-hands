import { Card, Suit, Value } from "../card/Card";
import { HandType } from "./Hand";

/**
 * The index of each suit in a HandState's suit masks
 */
export const SUIT_INDEX: Record<Suit, number> = {
  [Suit.hearts]: 0,
  [Suit.diamonds]: 1,
  [Suit.clubs]: 2,
  [Suit.spades]: 3,
};

/**
 * The suit masks of some cards, in the order of SUIT_INDEX (hearts,
 * diamonds, clubs, spades): bit v of a mask is set if the cards include that
 * suit's card of value v
 */
export type SuitMasks = [number, number, number, number];

export const suitMasksOf = (cards: Card[]): SuitMasks => {
  const masks: SuitMasks = [0, 0, 0, 0];
  for (const card of cards) masks[SUIT_INDEX[card.suit]] |= 1 << card.value;
  return masks;
};

/**
 * The cards of a hand in the form rankOf reads them: bit v of a suit mask is
 * set if the hand has that suit's card of value v. Cards are added and
 * removed in place, so a loop over many hands can reuse one state and
 * allocate nothing.
 */
export interface HandState {
  suitMasks: Uint16Array;
}

export const createHandState = (): HandState => ({
  suitMasks: new Uint16Array(4),
});

const bit = (value: number): number => 1 << value;

/**
 * The highest value in a mask, or 0 if it is empty
 */
const highest = (mask: number): number => (mask ? 31 - Math.clz32(mask) : 0);

// Lookup tables over all masks of the values 2-14 (bits 2-14), indexed by
// mask >> 2. They are computed once, by the loops below, so that rankOf
// only reads them.
const TABLE_SIZE = 1 << 13;

const countCards = (mask: number): number => {
  let count = 0;
  for (; mask; count++) mask &= mask - 1;
  return count;
};

/**
 * The top card of the highest straight in a mask of values, or 0 if there is
 * none. The ace also counts as 1, for the wheel A-2-3-4-5.
 */
const findStraightTop = (mask: number): number => {
  const withLowAce = mask & bit(Value.ace) ? mask | bit(1) : mask;
  for (let top: number = Value.ace; top >= Value.five; top--) {
    const run = 0b11111 << (top - 4);
    if ((withLowAce & run) === run) return top;
  }
  return 0;
};

/**
 * The five highest values of a mask, one hex digit each, highest first;
 * filled up with 0 if the mask has fewer
 */
const findHighestFive = (mask: number): number => {
  let digits = 0;
  let count = 0;
  for (
    let value: number = Value.ace;
    count < 5 && value >= Value.two;
    value--
  ) {
    if (mask & bit(value)) {
      digits = (digits << 4) | value;
      count++;
    }
  }
  return digits << (4 * (5 - count));
};

const tableOf = <Table extends Uint8Array | Uint32Array>(
  table: Table,
  compute: (mask: number) => number
): Table => {
  for (let index = 0; index < TABLE_SIZE; index++) {
    table[index] = compute(index << 2);
  }
  return table;
};

const CARD_COUNT = tableOf(new Uint8Array(TABLE_SIZE), countCards);
const STRAIGHT_TOP = tableOf(new Uint8Array(TABLE_SIZE), findStraightTop);
const HIGHEST_FIVE = tableOf(new Uint32Array(TABLE_SIZE), findHighestFive);

const cardCount = (mask: number): number => CARD_COUNT[mask >> 2];

/**
 * The top card of the highest straight in a mask of values, or 0
 */
const straightTop = (mask: number): number => STRAIGHT_TOP[mask >> 2];

/**
 * Appends a value to a rank `times` times, one hex digit each
 */
const withValue = (rank: number, value: number, times: number): number => {
  for (let i = 0; i < times; i++) rank = (rank << 4) | value;
  return rank;
};

/**
 * Appends the `count` (1 to 5) highest values of a mask to a rank
 */
const withHighest = (rank: number, mask: number, count: number): number =>
  (rank << (4 * count)) | (HIGHEST_FIVE[mask >> 2] >>> (4 * (5 - count)));

const straightRank = (type: HandType, top: number): number => {
  let rank: number = type;
  for (let value = top; value > top - 5; value--) rank = (rank << 4) | value;
  return rank;
};

/**
 * Adds a card, given by its suit index (see SUIT_INDEX) and value
 */
export const addCard = (state: HandState, suit: number, value: number) => {
  state.suitMasks[suit] |= bit(value);
};

/**
 * Removes a card that was added before
 */
export const removeCard = (state: HandState, suit: number, value: number) => {
  state.suitMasks[suit] &= ~bit(value);
};

/**
 * Removes all cards
 */
export const clearHandState = (state: HandState) => {
  state.suitMasks.fill(0);
};

/**
 * The rank of the best hand in 5 to 7 cards, given as their suit masks (see
 * SuitMasks), as handRank computes it.
 *
 * The hand types are checked from the best to the worst, and the first one
 * the cards make is the hand. Each check builds the rank from the hand type
 * and the values that decide between hands of that type, most important
 * first: e.g. the trips, then the pair for a full house.
 */
export const rankOf = (h: number, d: number, c: number, s: number): number => {
  // Flush: five or more cards of one suit. With at most 7 cards, only one
  // suit can have five, so the first one found is the flush suit.
  let flush = 0;
  if (cardCount(h) >= 5) flush = h;
  else if (cardCount(d) >= 5) flush = d;
  else if (cardCount(c) >= 5) flush = c;
  else if (cardCount(s) >= 5) flush = s;

  // Straight flush: five values in a row within the flush suit. It beats
  // everything, so it is decided before anything else is computed.
  if (flush) {
    const top = straightTop(flush);
    if (top === Value.ace) return straightRank(HandType.RoyalFlush, top);
    if (top) return straightRank(HandType.StraightFlush, top);
  }

  // A value occurs at most once per suit, so how often it occurs is the
  // number of suit masks it is in: values in at least two masks are pairs
  // (or better), in at least three trips (or better), in all four quads.
  const atLeastTwo = (h & d) | ((h | d) & (c | s)) | (c & s);
  const atLeastThree = (h & d & (c | s)) | ((h | d) & c & s);
  const quads = highest(h & d & c & s);

  // all values in the hand, for straights and kickers
  const all = h | d | c | s;

  // Four of a kind, with the highest other value as the kicker
  if (quads) {
    const rank = withValue(HandType.FourOfAKind, quads, 4);
    return withHighest(rank, all & ~bit(quads), 1);
  }

  // Full house: the highest trips, and as the pair the highest other value
  // that occurs at least twice. That can be a pair or a second set of trips.
  const trips = highest(atLeastThree);
  const fullHousePair = highest(atLeastTwo & ~bit(trips));
  if (trips && fullHousePair) {
    const rank = withValue(HandType.FullHouse, trips, 3);
    return withValue(rank, fullHousePair, 2);
  }

  // Flush: the five highest values of the flush suit
  if (flush) return withHighest(HandType.Flush, flush, 5);

  // Straight: five values in a row in any suits
  const top = straightTop(all);
  if (top) return straightRank(HandType.Straight, top);

  // Three of a kind, with the two highest other values as kickers. There is
  // no other pair here, or it would have been a full house.
  if (trips) {
    const rank = withValue(HandType.ThreeOfAKind, trips, 3);
    return withHighest(rank, all & ~bit(trips), 2);
  }

  // Two pair: the two highest pairs, with the highest other value as the
  // kicker. That can be a card of a third pair.
  const pair = highest(atLeastTwo);
  const lowerPair = highest(atLeastTwo & ~bit(pair));
  if (pair && lowerPair) {
    const rank = withValue(withValue(HandType.TwoPair, pair, 2), lowerPair, 2);
    return withHighest(rank, all & ~bit(pair) & ~bit(lowerPair), 1);
  }

  // Pair, with the three highest other values as kickers
  if (pair) {
    const rank = withValue(HandType.Pair, pair, 2);
    return withHighest(rank, all & ~bit(pair), 3);
  }

  // High card: the five highest values
  return withHighest(HandType.HighCard, all, 5);
};
