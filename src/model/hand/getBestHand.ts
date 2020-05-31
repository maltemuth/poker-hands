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

const getBestHand = (cards: Card[]): HandInterface | null => {
  const precalculatedValueCounts = valueCounts(cards);
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
    (hand: HandInterface, get) => hand || get(cards, precalculatedValueCounts),
    null
  );
};
export default getBestHand;
