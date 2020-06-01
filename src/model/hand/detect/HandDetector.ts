import { Card } from "../../card/Card";
import { ValueCounts } from "../../card/valueCounts";

/**
 * interface for a function that detects a hand in the given list of card
 */
export type HandDetector = (
  cards: Card[],
  precalulatedValueCounts?: ValueCounts
) => boolean;
