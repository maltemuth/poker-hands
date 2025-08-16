import hasValueCount from "../../card/hasValueCount";
import { Card } from "../../card/Card";
import sortValueCounts from "../../card/sortValueCounts";

/**
 * returns true if a four-of-a-kind is contained within the given cards
 * @param cards
 */
const hasFourOfAkind = (
  cards: Card[],
  sortedValueCounts = sortValueCounts(cards)
) => hasValueCount(cards, 4, 1, sortedValueCounts);

export default hasFourOfAkind;
