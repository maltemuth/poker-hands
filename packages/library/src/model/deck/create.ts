import cards from "../card/cards.js";
import { Card } from "../card/Card.js";

const cardStrings = [
  "2h",
  "3h",
  "4h",
  "5h",
  "6h",
  "7h",
  "8h",
  "9h",
  "Th",
  "Jh",
  "Qh",
  "Kh",
  "Ah",

  "2d",
  "3d",
  "4d",
  "5d",
  "6d",
  "7d",
  "8d",
  "9d",
  "Td",
  "Jd",
  "Qd",
  "Kd",
  "Ad",

  "2c",
  "3c",
  "4c",
  "5c",
  "6c",
  "7c",
  "8c",
  "9c",
  "Tc",
  "Jc",
  "Qc",
  "Kc",
  "Ac",

  "2s",
  "3s",
  "4s",
  "5s",
  "6s",
  "7s",
  "8s",
  "9s",
  "Ts",
  "Js",
  "Qs",
  "Ks",
  "As",
];

/**
 * Creates a complete standard 52-card poker deck.
 *
 * This function generates all 52 cards in a standard poker deck, including
 * all four suits (hearts, diamonds, clubs, spades) and all 13 values
 * (2 through 10, Jack, Queen, King, Ace). The deck is returned in a
 * consistent order: hearts from 2 to Ace, followed by diamonds, clubs,
 * and spades in the same order.
 *
 * @returns Array of 52 Card objects representing a complete poker deck
 *
 * @example
 * ```typescript
 * import create from './create.js';
 *
 * const deck = create();
 * console.log(deck.length); // 52
 *
 * // First card is 2 of hearts
 * console.log(deck[0]); // Card { suit: 'hearts', value: 2 }
 *
 * // Last card is Ace of spades
 * console.log(deck[51]); // Card { suit: 'spades', value: 14 }
 * ```
 *
 * @example
 * ```typescript
 * // Create a deck and then shuffle it
 * import shuffle from './shuffle.js';
 *
 * const deck = create();
 * const shuffledDeck = shuffle(deck);
 * ```
 */
const create = (): Card[] => cards(...cardStrings);

export default create;
