import hasValueCount from "../../card/hasValueCount";
import { Card } from "../../card/Card";
import sortValueCounts from "../../card/sortValueCounts";

/**
 * returns true if a pair is contained within the given cards
 * @param cards
 */
const hasPair = (cards: Card[], sortedValueCounts = sortValueCounts(cards)) =>
  hasValueCount(cards, 2, 1, sortedValueCounts);

export default hasPair;
