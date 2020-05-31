import { HandDetector } from "./HandDetector";
import hasValueCount from "../../card/hasValueCount";

/**
 * returns true if a pair is contained within the given cards
 * @param cards
 */
const hasPair: HandDetector = (cards, precalculatedValueCounts) =>
  hasValueCount(cards, 2, 1, precalculatedValueCounts);

export default hasPair;
