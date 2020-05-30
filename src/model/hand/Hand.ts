import { Value } from "../card/Card";

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
 * an interface for a hand
 */
export interface HandInterface {
  type: HandType;
  value: Value;
  subvalue: Value | null;
  kickers: Value[];
}

/**
 * a type for a specific hand
 */
export type Hand<ofType> = HandInterface & {
  type: ofType;
};
