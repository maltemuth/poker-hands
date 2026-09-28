import { Card } from "./Card";

/**
 * Sorts cards from the lowest to the highest value, without changing the
 * input
 */
const sortByValue = (cards: Card[]): Card[] =>
  [...cards].sort((a, b) => a.value - b.value);

export default sortByValue;
