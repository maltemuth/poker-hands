import hasValueCount from "../../card/hasValueCount.js";
import { Card } from "../../card/Card.js";
import sortValueCounts from "../../card/sortValueCounts.js";

/**
 * returns true if a four-of-a-kind is contained within the given cards
 * @param cards
 */
const hasFourOfAkind = (
  cards: Card[],
  sortedValueCounts = sortValueCounts(cards)
) => hasValueCount(cards, 4, 1, sortedValueCounts);

export default hasFourOfAkind;
