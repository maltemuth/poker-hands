import { HandDetector } from "./HandDetector";
import hasValueCount from "../../card/hasValueCount";

/**
 * returns true if a three-of-a-kind is contained within the given cards
 * @param cards
 */
const hasThreeOfAKind: HandDetector = (cards, precalculatedValueCounts) =>
  hasValueCount(cards, 3, 1, precalculatedValueCounts);

export default hasThreeOfAKind;
