import { Card } from "../card/Card.js";

/**
 * all possible hand types, in order from lowest to highest
 */
export enum HandType {
  HighCard = 1,
  Pair,
  TwoPair,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalFlush,
}

/**
 * a hand: its type, the cards that make it and the kickers, which together
 * are the best five cards
 */
export interface HandInterface {
  type: HandType;
  cards: () => Card[];
  kickers: () => Card[];
}

/**
 * a type for a specific hand
 */
export type Hand<ofType> = HandInterface & {
  type: ofType;
};
