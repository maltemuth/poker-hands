import { HandDetector } from "./HandDetector";
import hasValueCount from "../../card/hasValueCount";

/**
 * returns true if two pairs are contained within the given cards
 * @param cards
 */
const hasTwoPair: HandDetector = (cards, precalculatedValueCounts) =>
  hasValueCount(cards, 2, 2, precalculatedValueCounts);

export default hasTwoPair;
