import { Card } from "./Card";
import valueCounts from "./valueCounts";

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
  precalculatedValueCounts = valueCounts(cards)
): boolean => {
  return (
    Object.values(precalculatedValueCounts).filter(
      (value) => value >= minimumCount
    ).length >= atLeast
  );
};

export default hasValueCount;
