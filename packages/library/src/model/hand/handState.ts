import { Suit, Value } from "../card/Card";
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
 * The rank of the best hand in a state of 5 to 7 cards, see handRank
 */
export const rankOf = ({ suitMasks }: HandState): number => {
  const h = suitMasks[0];
  const d = suitMasks[1];
  const c = suitMasks[2];
  const s = suitMasks[3];
  const all = h | d | c | s;

  // with at most 7 cards, only one suit can have five
  let flush = 0;
  if (bitCount(h) >= 5) flush = h;
  else if (bitCount(d) >= 5) flush = d;
  else if (bitCount(c) >= 5) flush = c;
  else if (bitCount(s) >= 5) flush = s;

  if (flush) {
    const top = straightTop(flush);
    if (top === Value.ace) return straightRank(HandType.RoyalFlush, top);
    if (top) return straightRank(HandType.StraightFlush, top);
  }

  // A value occurs at most once per suit, so the values held in at least two
  // suits are the pairs (and better), in at least three the trips, and so on.
  const atLeastTwo = (h & d) | ((h | d) & (c | s)) | (c & s);
  const atLeastThree = (h & d & (c | s)) | ((h | d) & c & s);
  const quads = highest(h & d & c & s);

  if (quads) {
    const rank = withValue(HandType.FourOfAKind, quads, 4);
    return withHighest(rank, all & ~bit(quads), 1);
  }
  const trips = highest(atLeastThree);
  // the full house's pair: a second three of a kind or the highest pair
  const fullHousePair = highest(atLeastTwo & ~bit(trips));
  if (trips && fullHousePair) {
    const rank = withValue(HandType.FullHouse, trips, 3);
    return withValue(rank, fullHousePair, 2);
  }
  if (flush) return withHighest(HandType.Flush, flush, 5);

  const top = straightTop(all);
  if (top) return straightRank(HandType.Straight, top);

  if (trips) {
    const rank = withValue(HandType.ThreeOfAKind, trips, 3);
    return withHighest(rank, all & ~bit(trips), 2);
  }
  const pair = highest(atLeastTwo);
  const lowerPair = highest(atLeastTwo & ~bit(pair));
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
