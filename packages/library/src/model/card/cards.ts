import fromString from "./fromString.js";
import { Card } from "./Card.js";

/**
 * Creates an array of Card objects from string representations.
 *
 * This function converts card strings (e.g., "As", "Kh", "Td") into
 * Card objects. Each string should consist of a value (2-9, T, J, Q, K, A)
 * followed by a suit (h, d, c, s).
 *
 * @param inputs - Variable number of card strings to convert
 * @returns Array of Card objects corresponding to the input strings
 *
 * @throws {Error} If any input string is not a valid card representation
 *
 * @example
 * ```typescript
 * import cards from './cards.js';
 *
 * // Create individual cards
 * const aceOfSpades = cards('As'); // Returns [Card { suit: 'spades', value: 14 }]
 *
 * // Create multiple cards at once
 * const hand = cards('As', 'Ks', 'Qs', 'Js', 'Ts');
 * // Returns array of 5 Card objects for a royal flush
 *
 * // Invalid card strings will throw an error
 * cards('invalid'); // Throws Error
 * cards('1z'); // Throws Error (invalid suit)
 * ```
 */
const cards = (...inputs: string[]): Card[] => inputs.map(fromString);

export default cards;
