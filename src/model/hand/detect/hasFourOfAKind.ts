import { HandDetector } from "./HandDetector";
import hasValueCount from "../../card/hasValueCount";
import valueCounts from "../../card/valueCounts";

/**
 * returns true if a four-of-a-kind is contained within the given cards
 * @param cards
 */
const hasFourOfAkind: HandDetector = (
  cards,
  precalculatedValueCounts = valueCounts(cards)
) => hasValueCount(cards, 4, 1, precalculatedValueCounts);

export default hasFourOfAkind;
