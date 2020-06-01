import { Card } from "../card/Card";
import { HandInterface } from "./Hand";
import getRoyalFlush from "./get/getRoyalFlush";
import getStraightFlush from "./get/getStraightFlush";
import getFourOfAKind from "./get/getFourOfAKind";
import getFullHouse from "./get/getFullHouse";
import getFlush from "./get/getFlush";
import getStraight from "./get/getStraight";
import getThreeOfAKind from "./get/getThreeOfAKind";
import getTwoPair from "./get/getTwoPair";
import getPair from "./get/getPair";
import getHighCard from "./get/getHighCard";
import sortedValues from "../card/sortedValues";
import sortedSuits from "../card/sortedSuits";
import hasRoyalFlush from "./detect/hasRoyalFlush";
import hasFlush from "./detect/hasFlush";
import hasStraight from "./detect/hasStraight";
import hasStraightFlush from "./detect/hasStraightFlush";
import hasPair from "./detect/hasPair";
import hasFourOfAkind from "./detect/hasFourOfAKind";
import hasFullHouse from "./detect/hasFullHouse";
import hasThreeOfAKind from "./detect/hasThreeOfAKind";
import hasTwoPair from "./detect/hasTwoPair";

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

    if (!hasPair(cards, presortedValues)) {
      // no pair means no full house and no four-of-a-kind either, so flush is the best possible card
      return getFlush(cards);
    } else {
      if (hasFourOfAkind(cards, presortedValues)) {
        return getFourOfAKind(cards, presortedValues);
      }
      if (hasFullHouse(cards, presortedValues)) {
        return getFullHouse(cards, presortedValues);
      }
      // no full house and no four-of-a-kind means flush is highest again
      return getFlush(cards);
    }
  } else {
    // no flush
    if (straightPossible) {
      if (!hasPair(cards, presortedValues)) {
        // no full house and no four-of-a-kind means straig is highest
        // since no flush already, we also can't get the straight flush
        return getStraight(cards);
      }

      if (hasFourOfAkind(cards, presortedValues)) {
        return getFourOfAKind(cards, presortedValues);
      }

      if (hasFullHouse(cards, presortedValues)) {
        return getFullHouse(cards, presortedValues);
      }

      // if no full house and no four-of-a-kind, straight is highest again
      return getStraight(cards);
    }

    // from here on: no flush, no straight; only card combos remain

    if (!hasPair(cards, presortedValues)) {
      return getHighCard(cards);
    }

    if (!hasThreeOfAKind(cards, presortedValues)) {
      // a pair, but no three-of-a-kind means there is only a two-pair is still possible
      if (hasTwoPair(cards, presortedValues)) {
        return getTwoPair(cards, presortedValues);
      }

      return getPair(cards, presortedValues);
    }

    // now, the usual is possible
    if (hasFourOfAkind(cards, presortedValues)) {
      return getFourOfAKind(cards, presortedValues);
    }

    if (hasFullHouse(cards, presortedValues)) {
      return getFullHouse(cards, presortedValues);
    }

    return getThreeOfAKind(cards, presortedValues);
  }

  // return [
  //   getRoyalFlush,
  //   getStraightFlush,
  //   getFourOfAKind,
  //   getFullHouse,
  //   getFlush,
  //   getStraight,
  //   getThreeOfAKind,
  //   getTwoPair,
  //   getPair,
  //   getHighCard,
  // ].reduce(
  //   (hand: HandInterface, get) =>
  //     hand ||
  //     get(cards, presortedValues, presortedSuits, precalculatedValueCounts),
  //   null
  // );
};
export default getBestHand;
