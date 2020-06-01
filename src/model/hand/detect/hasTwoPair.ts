import hasValueCount from "../../card/hasValueCount";
import { Card } from "../../card/Card";
import sortValueCounts from "../../card/sortValueCounts";

/**
 * returns true if two pairs are contained within the given cards
 * @param cards
 */
const hasTwoPair = (
  cards: Card[],
  sortedValueCounts = sortValueCounts(cards)
) => hasValueCount(cards, 2, 2, sortedValueCounts);

export default hasTwoPair;
