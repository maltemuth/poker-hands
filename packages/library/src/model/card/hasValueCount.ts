import { Card } from "./Card.js";
import sortValueCounts from "./sortValueCounts.js";
/**
 * returns true if any value is repeated at least minimumCount times in the given list of cards
 * if atLeast is given and greater than 1, only returns true if at least atLeast different values are repeated at least minimumCount times
 * @param cards
 * @param minimumCount
 * @param atLeast
 */
const hasValueCount = (
  cards: Card[],
  minimumCount: number,
  atLeast: number = 1,
  sortedValueCounts = sortValueCounts(cards)
): boolean => {
  if (sortedValueCounts.length < atLeast) return false;

  for (let i = 0; i < atLeast; i++) {
    if (sortedValueCounts[i] < minimumCount) return false;
  }

  return true;
};

export default hasValueCount;
