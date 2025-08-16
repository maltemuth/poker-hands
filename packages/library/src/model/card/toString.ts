import { Card } from "./Card";
import valueToString from "./valueToString";

/**
 * returns a string representing the given card
 * @param card
 */
const toString = (card: Card): string =>
  `${valueToString(card.value)}${card.suit}`;

export default toString;
