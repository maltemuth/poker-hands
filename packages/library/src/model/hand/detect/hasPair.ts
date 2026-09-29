import hasValueCount from "../../card/hasValueCount.js";
import { Card } from "../../card/Card.js";
import sortValueCounts from "../../card/sortValueCounts.js";

/**
 * returns true if a pair is contained within the given cards
 * @param cards
 */
const hasPair = (cards: Card[], sortedValueCounts = sortValueCounts(cards)) =>
  hasValueCount(cards, 2, 1, sortedValueCounts);

export default hasPair;
