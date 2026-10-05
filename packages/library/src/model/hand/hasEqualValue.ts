import { HandInterface } from "./Hand.js";
import handRank from "./handRank.js";

/**
 * Determines if two poker hands are equally strong, so that they would split
 * a pot: suits don't matter, see handRank.
 *
 * @example
 * ```typescript
 * const hand1 = getBestHand(cards("Ah", "Kh", "Qh", "Jh", "Th"));
 * const hand2 = getBestHand(cards("As", "Ks", "Qs", "Js", "Ts"));
 *
 * hasEqualValue(hand1, hand2); // true (both are royal flushes)
 * ```
 */
const hasEqualValue = (a: HandInterface, b: HandInterface): boolean =>
  handRank(a) === handRank(b);

export default hasEqualValue;
