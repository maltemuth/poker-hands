import { Card } from "../card/Card.js";
import { HandInterface } from "./Hand.js";
import getRoyalFlush from "./get/getRoyalFlush.js";
import getStraightFlush from "./get/getStraightFlush.js";
import getFourOfAKind from "./get/getFourOfAKind.js";
import getFullHouse from "./get/getFullHouse.js";
import getFlush from "./get/getFlush.js";
import getStraight from "./get/getStraight.js";
import getThreeOfAKind from "./get/getThreeOfAKind.js";
import getTwoPair from "./get/getTwoPair.js";
import getPair from "./get/getPair.js";
import getHighCard from "./get/getHighCard.js";
import sortedValues from "../card/sortedValues.js";
import sortedSuits from "../card/sortedSuits.js";
import hasRoyalFlush from "./detect/hasRoyalFlush.js";
import hasFlush from "./detect/hasFlush.js";
import hasStraight from "./detect/hasStraight.js";
import hasStraightFlush from "./detect/hasStraightFlush.js";
import hasPair from "./detect/hasPair.js";
import hasFourOfAkind from "./detect/hasFourOfAKind.js";
import hasFullHouse from "./detect/hasFullHouse.js";
import hasThreeOfAKind from "./detect/hasThreeOfAKind.js";
import hasTwoPair from "./detect/hasTwoPair.js";
import sortValueCounts from "../card/sortValueCounts.js";

/**
 * Determines the best possible poker hand from a given set of cards.
 *
 * This function evaluates all possible 5-card combinations from the input cards
 * and returns the highest-ranking poker hand. It checks for all hand types
 * from royal flush down to high card, returning the best possible hand.
 *
 * @param cards - An array of Card objects to evaluate. Must contain at least 5 cards.
 * @returns The best HandInterface object representing the highest-ranking poker hand,
 *          or null if fewer than 5 cards are provided.
 *
 * @throws {Error} If fewer than 5 cards are provided.
 *
 * @example
 * ```typescript
 * import cards from './cards';
 * import getBestHand from './getBestHand.js';
 *
 * const myCards = cards('Ah', 'Kh', 'Qh', 'Jh', 'Th');
 * const bestHand = getBestHand(myCards);
 * // Returns a HandInterface representing a royal flush
 * ```
 */
const getBestHand = (cards: Card[]): HandInterface | null => {
  const presortedSuits = sortedSuits(cards);
  const presortedValues = sortedValues(cards);

  const flushPossible = hasFlush(cards, presortedSuits);
  const straightPossible = hasStraight(cards, presortedValues);

  if (flushPossible) {
    if (
      hasStraightFlush(
        cards,
        presortedValues,
        presortedSuits,
        true,
        straightPossible
      )
    ) {
      if (hasRoyalFlush(cards)) return getRoyalFlush(cards);
      return getStraightFlush(cards);
    }

    const sortedValueCounts = sortValueCounts(cards);

    if (!hasPair(cards, sortedValueCounts)) {
      // no pair means no full house and no four-of-a-kind either, so flush is the best possible card
      return getFlush(cards);
    } else {
      if (hasFourOfAkind(cards, sortedValueCounts)) {
        return getFourOfAKind(cards, presortedValues);
      }
      if (hasFullHouse(cards, sortedValueCounts)) {
        return getFullHouse(cards, presortedValues);
      }
      // no full house and no four-of-a-kind means flush is highest again
      return getFlush(cards);
    }
  } else {
    // no flush
    const sortedValueCounts = sortValueCounts(cards);
    if (straightPossible) {
      if (!hasPair(cards, sortedValueCounts)) {
        // no full house and no four-of-a-kind means straig is highest
        // since no flush already, we also can't get the straight flush
        return getStraight(cards);
      }

      if (hasFourOfAkind(cards, sortedValueCounts)) {
        return getFourOfAKind(cards, presortedValues);
      }

      if (hasFullHouse(cards, sortedValueCounts)) {
        return getFullHouse(cards, presortedValues);
      }

      // if no full house and no four-of-a-kind, straight is highest again
      return getStraight(cards);
    }

    // from here on: no flush, no straight; only card combos remain

    if (!hasPair(cards, sortedValueCounts)) {
      return getHighCard(cards);
    }

    if (!hasThreeOfAKind(cards, sortedValueCounts)) {
      // a pair, but no three-of-a-kind means there is only a two-pair is still possible
      if (hasTwoPair(cards, sortedValueCounts)) {
        return getTwoPair(cards, presortedValues);
      }

      return getPair(cards, presortedValues);
    }

    // now, the usual is possible
    if (hasFourOfAkind(cards, sortedValueCounts)) {
      return getFourOfAKind(cards, presortedValues);
    }

    if (hasFullHouse(cards, sortedValueCounts)) {
      return getFullHouse(cards, presortedValues);
    }

    return getThreeOfAKind(cards, presortedValues);
  }
};
export default getBestHand;
