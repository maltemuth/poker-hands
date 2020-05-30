/**
 * all possible card suits, by name
 */
export enum Suit {
  hearts = "H",
  diamonds = "D",
  clubs = "C",
  spades = "S",
}

/**
 * all possible card values, by name
 * this is also a double-look-up map since we're using integer values,
 * @see https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings
 */
export enum Value {
  two = 2,
  three = 3,
  four = 4,
  five = 5,
  six = 6,
  seven = 7,
  eight = 8,
  nine = 9,
  ten = 10,
  jack = 11,
  queen = 12,
  king = 13,
  ace = 14,
}

/**
 * look-up map for values represented as strings
 */
export enum ValueAsString {
  two = "2",
  three = "3",
  four = "4",
  five = "5",
  six = "6",
  seven = "7",
  eight = "8",
  nine = "9",
  ten = "T",
  jack = "J",
  queen = "Q",
  king = "K",
  ace = "A",
}

/**
 * interface for a card
 */
export interface Card {
  suit: Suit;
  value: Value;
}
