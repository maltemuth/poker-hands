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

const getBestHand = (cards: Card[]): HandInterface | null =>
  [
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
  ].reduce((hand: HandInterface, get) => hand || get(cards), null);

export default getBestHand;
