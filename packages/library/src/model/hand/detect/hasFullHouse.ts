import hasValueCount from "../../card/hasValueCount.js";
import { Card } from "../../card/Card.js";
import sortValueCounts from "../../card/sortValueCounts.js";

/**
 * returns true if a full house is contained within the given cards
 * @param cards
 */
const hasFullHouse = (
  cards: Card[],
  sortedValueCounts = sortValueCounts(cards)
) =>
  hasValueCount(cards, 3, 1, sortedValueCounts) &&
  hasValueCount(cards, 2, 2, sortedValueCounts);

export default hasFullHouse;
