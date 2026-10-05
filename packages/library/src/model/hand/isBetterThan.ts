import { HandInterface } from "./Hand.js";
import handRank from "./handRank.js";

/**
 * Determines if one poker hand is better than another: by hand type first,
 * then by the values that decide between hands of that type, see handRank.
 *
 * @example
 * ```typescript
 * const royalFlush = getBestHand(cards("Ah", "Kh", "Qh", "Jh", "Th"));
 * const straight = getBestHand(cards("Kd", "Qc", "Jd", "Td", "9s"));
 *
 * isBetterThan(royalFlush, straight); // true
 * ```
 */
const isBetterThan = (a: HandInterface, b: HandInterface): boolean =>
  handRank(a) > handRank(b);

export default isBetterThan;
