import { Card } from "./Card";
import sortedValues from "./sortedValues";

export type ValueCounts = { [value: number]: number };

/**
 * returns an object whose keys are card values and the corresponding values are counting how often the
 * value is repeated in the given list of cards
 * @param cards
 */
const valueCounts = (
  cards: Card[],
  presortedValues = sortedValues(cards)
): ValueCounts =>
  presortedValues.reduce((counts, value) => {
    counts[value] = counts[value] + 1 || 1;
    return counts;
  }, {});

export default valueCounts;
