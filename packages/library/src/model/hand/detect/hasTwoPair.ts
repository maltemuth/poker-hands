import hasValueCount from "../../card/hasValueCount.js";
import { Card } from "../../card/Card.js";
import sortValueCounts from "../../card/sortValueCounts.js";

/**
 * returns true if two pairs are contained within the given cards
 * @param cards
 */
const hasTwoPair = (
  cards: Card[],
  sortedValueCounts = sortValueCounts(cards)
) => hasValueCount(cards, 2, 2, sortedValueCounts);

export default hasTwoPair;
