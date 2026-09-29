import { Hand } from "./Hand.js";
import valueToString from "../card/valueToString.js";
import { Card } from "../card/Card.js";
import numericalSort from "../../lib/numericalSort.js";

const serializeValues = (cards: Card[]): string =>
  cards
    .map(({ value }) => value)
    .sort(numericalSort)
    .map(valueToString)
    .join("");

/**
 * Determines if two poker hands have equal value.
 *
 * This function compares two hands by checking their type, value, subvalue,
 * and the specific cards they contain. It returns true only if all aspects
 * of the hands are equal.
 *
 * @param a - The first hand to compare
 * @param b - The second hand to compare
 * @returns true if both hands have equal value, false otherwise
 *
 * @example
 * ```typescript
 * import cards from '../card/cards.js';
 * import getBestHand from './getBestHand.js';
 * import hasEqualValue from './hasEqualValue.js';
 *
 * const hand1 = getBestHand(cards('Ah', 'Kh', 'Qh', 'Jh', 'Th'));
 * const hand2 = getBestHand(cards('As', 'Ks', 'Qs', 'Js', 'Ts'));
 *
 * console.log(hasEqualValue(hand1, hand2)); // true (both are royal flushes)
 * ```
 */
const hasEqualValue = (a: Hand<any>, b: Hand<any>): boolean => {
  if (a.type !== b.type) return false;
  if (a.value() !== b.value()) return false;
  if (a.subvalue() !== b.subvalue()) return false;
  if (serializeValues(a.cards()) !== serializeValues(b.cards())) return false;
  if (serializeValues(a.kickers()) !== serializeValues(b.kickers()))
    return false;
  return true;
};

export default hasEqualValue;
