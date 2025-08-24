import { Hand } from "./Hand";
import hasBetterValues from "../card/hasBetterValues";

/**
 * Determines if one poker hand is better than another.
 *
 * This function compares two hands using standard poker hand ranking rules:
 * 1. First compares hand types (e.g., flush beats straight)
 * 2. If types are equal, compares primary values (e.g., higher pair wins)
 * 3. If primary values are equal, compares secondary values (e.g., in full house)
 * 4. If all else fails, compares kickers (remaining cards)
 *
 * @param a - The first hand to compare
 * @param b - The second hand to compare
 * @returns true if hand a is better than hand b, false otherwise
 *
 * @example
 * ```typescript
 * import cards from '../card/cards';
 * import getBestHand from './getBestHand';
 * import isBetterThan from './isBetterThan';
 *
 * const hand1 = getBestHand(cards('Ah', 'Kh', 'Qh', 'Jh', 'Th')); // Royal flush
 * const hand2 = getBestHand(cards('Kd', 'Kd', 'Qd', 'Jd', 'Td')); // King-high straight
 *
 * console.log(isBetterThan(hand1, hand2)); // true (royal flush beats straight)
 * ```
 */
const isBetterThan = (a: Hand<any>, b: Hand<any>): boolean => {
  if (a.type > b.type) return true;
  if (a.type === b.type) {
    if (a.value() > b.value()) return true;
    if (a.value() === b.value()) {
      const aSubvalue = a.subvalue();
      const bSubvalue = b.subvalue();
      if (aSubvalue !== null && bSubvalue !== null && aSubvalue > bSubvalue)
        return true;
      if (aSubvalue === bSubvalue) {
        // now, we actually have to compare card-by-card, since e.g. flushes are compared this way
        if (hasBetterValues(a.cards(), b.cards())) return true;
        if (hasBetterValues(a.kickers(), b.kickers())) return true;
        // if neither the cards nor the kickers can solve this, values are equal - and we return false
        return false;
      }
      return false;
    }
    return false;
  }
  return false;
};

export default isBetterThan;
