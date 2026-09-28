import { HandInterface, HandType } from "./Hand";

/**
 * Bits per digit of a rank: enough for a hand type (1-10) or a card value
 * (1-14, 1 being the ace of a wheel)
 */
const DIGIT_BITS = 4;

/**
 * The five card values of a hand, most important first: values that occur
 * more often come first, higher values before lower ones. E.g. K K K 9 9 for
 * a full house or A A 8 8 K for two pair.
 *
 * Straights count down from their top card, so in a wheel (A-2-3-4-5) the
 * ace counts as 1. Hands of fewer than five cards are filled up with 0.
 */
const valuesByImportance = (hand: HandInterface): number[] => {
  if (
    hand.type === HandType.Straight ||
    hand.type === HandType.StraightFlush ||
    hand.type === HandType.RoyalFlush
  ) {
    const top = hand.value();
    return [top, top - 1, top - 2, top - 3, top - 4];
  }

  const values = [...hand.cards(), ...hand.kickers()].map(({ value }) => value);
  const count = (value: number) =>
    values.filter((other) => other === value).length;
  const sorted = values.sort((a, b) => count(b) - count(a) || b - a);

  return [...sorted, 0, 0, 0, 0, 0].slice(0, 5);
};

/**
 * The strength of a hand as a single number: a better hand has a higher
 * rank, equally strong hands have the same rank. So instead of isBetterThan
 * and hasEqualValue, ranks can be compared with > and ===.
 *
 * The rank is the hand type followed by the five card values by importance,
 * one hex digit each. E.g. the full house K K K 9 9 is 0x7ddd99, the
 * two pair A A 8 8 K is 0x3ee88d.
 *
 * @param hand - A hand, e.g. from getBestHand
 * @returns The hand's rank, a positive integer below 2^24
 *
 * @example
 * ```typescript
 * const a = handRank(getBestHand(cards("Kh", "Kd", "Ks", "9c", "9d"))!);
 * const b = handRank(getBestHand(cards("Qh", "Qd", "Qs", "3c", "3d"))!);
 * a > b; // true
 * ```
 */
const handRank = (hand: HandInterface): number =>
  valuesByImportance(hand).reduce(
    (rank, value) => (rank << DIGIT_BITS) | value,
    hand.type as number
  );

export default handRank;
