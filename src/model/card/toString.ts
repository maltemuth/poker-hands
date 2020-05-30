import { Card } from "./Card";
import valueToString from "./valueToString";

/**
 * returns a string representing the given card
 * @param card
 */
const toString = (card: Card): string =>
  `${card.suit}${valueToString(card.value)}`;

export default toString;
