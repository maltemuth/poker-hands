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
 * import { Card } from './Card.js';
 * import toString from './toString.js';
 *
 * const aceOfSpades: Card = { suit: 'spades', value: 14 };
 * console.log(toString(aceOfSpades)); // "As"
 *
 * const tenOfHearts: Card = { suit: 'hearts', value: 10 };
 * console.log(toString(tenOfHearts)); // "Th"
 *
 * const twoOfClubs: Card = { suit: 'clubs', value: 2 };
 * console.log(toString(twoOfClubs)); // "2c"
 * ```
 */
const toString = (card: Card): string =>
  `${valueToString(card.value)}${card.suit}`;

export default toString;
