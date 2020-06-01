import { Card } from "./Card";
import sortedValues from "./sortedValues";

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
  presortedValues = sortedValues(cards)
): boolean => {
  const counts = {};
  const foundTargets = [];
  for (let i = 0; i < presortedValues.length; i++) {
    const value = presortedValues[i];
    counts[value] = counts[value] + 1 || 1;
    if (counts[value] >= minimumCount) {
      if (!foundTargets.includes(value)) foundTargets.push(value);
      if (foundTargets.length >= atLeast) return true;
    }
  }

  return false;
};

export default hasValueCount;
