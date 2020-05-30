import { Card } from "../../card/Card";

/**
 * interface for a function that detects a hand in the given list of card
 */
export type HandDetector = (cards: Card[]) => boolean;
