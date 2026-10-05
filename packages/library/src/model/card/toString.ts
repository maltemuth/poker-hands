import { Card } from "./Card.js";
import valueToString from "./valueToString.js";

/**
 * Converts a Card object to its string representation.
 *
 * This function takes a Card object and returns a string in the standard
 * poker notation format: value followed by suit. For example, an Ace
 * of spades becomes "As", a 10 of hearts becomes "Th", etc.
 *
 * @param card - The Card object to convert
 * @returns String representation of the card (e.g., "As", "Kh", "Td")
 *
 * @example
 * ```typescript
 * import { Card, Suit, Value } from './Card.js';
 * import toString from './toString.js';
 *
 * const aceOfSpades: Card = { suit: Suit.spades, value: Value.ace };
 * console.log(toString(aceOfSpades)); // "As"
 *
 * const tenOfHearts: Card = { suit: Suit.hearts, value: Value.ten };
 * console.log(toString(tenOfHearts)); // "Th"
 *
 * const twoOfClubs: Card = { suit: Suit.clubs, value: Value.two };
 * console.log(toString(twoOfClubs)); // "2c"
 * ```
 */
const toString = (card: Card): string =>
  `${valueToString(card.value)}${card.suit}`;

export default toString;
