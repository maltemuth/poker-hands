import { Card, Value, Suit } from "../../card/Card";
import { ValueCounts } from "../../card/valueCounts";
import { Hand } from "../Hand";

/**
 * interface for a function that detects a hand in the given list of card
 */
export type HandGetter<HandType> = (
  cards: Card[],
  presortedValues?: Value[],
  presortedSuits?: Suit[],
  precalulatedValueCounts?: ValueCounts
) => Hand<HandType> | null;
