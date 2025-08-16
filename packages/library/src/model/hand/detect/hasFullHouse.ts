import hasValueCount from "../../card/hasValueCount";
import { Card } from "../../card/Card";
import sortValueCounts from "../../card/sortValueCounts";

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
