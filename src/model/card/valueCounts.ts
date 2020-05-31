import { Card } from "./Card";

/**
 * returns an object whose keys are card values and the corresponding values are counting how often the
 * value is repeated in the given list of cards
 * @param cards
 */
const valueCounts = (cards: Card[]): { [value: number]: number } =>
  cards
    .map(({ value }) => value)
    .reduce((counts, value) => {
      counts[value] = counts[value] || 0;

      counts[value] += 1;

      return counts;
    }, {});

export default valueCounts;
