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
import valueCounts from "../card/valueCounts";
import sortedValues from "../card/sortedValues";
import sortedSuits from "../card/sortedSuits";

const getBestHand = (cards: Card[]): HandInterface | null => {
  const presortedValues = sortedValues(cards);
  const precalculatedValueCounts = valueCounts(cards, presortedValues);
  const presortedSuits = sortedSuits(cards);
  return [
    getRoyalFlush,
    getStraightFlush,
    getFourOfAKind,
    getFullHouse,
    getFlush,
    getStraight,
    getThreeOfAKind,
    getTwoPair,
    getPair,
    getHighCard,
  ].reduce(
    (hand: HandInterface, get) =>
      hand ||
      get(cards, presortedValues, presortedSuits, precalculatedValueCounts),
    null
  );
};
export default getBestHand;
