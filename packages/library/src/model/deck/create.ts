import cards from "../card/cards.js";
import { Card } from "../card/Card.js";

// hearts from 2 to ace, then diamonds, clubs and spades
const cardStrings = [..."hdcs"].flatMap((suit) =>
  [..."23456789TJQKA"].map((value) => value + suit)
);

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
 * console.log(deck[0]); // { suit: 'h', value: 2 }
 *
 * // Last card is Ace of spades
 * console.log(deck[51]); // { suit: 's', value: 14 }
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
