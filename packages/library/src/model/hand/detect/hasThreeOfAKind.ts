import hasValueCount from "../../card/hasValueCount.js";
import { Card } from "../../card/Card.js";
import sortValueCounts from "../../card/sortValueCounts.js";

/**
 * returns true if a three-of-a-kind is contained within the given cards
 * @param cards
 */
const hasThreeOfAKind = (
  cards: Card[],
  sortedValueCounts = sortValueCounts(cards)
) => hasValueCount(cards, 3, 1, sortedValueCounts);

export default hasThreeOfAKind;
