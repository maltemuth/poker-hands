import { Card } from "../../card/Card.js";
import { HandType, Hand } from "../Hand.js";
import getStraightFlush from "./getStraightFlush.js";
import purify from "../../../lib/purify.js";

const getRoyalFlush = (cards: Card[]): Hand<HandType.RoyalFlush> | null => {
  const straightFlush = purify(() => getStraightFlush(cards));

  const result = straightFlush();
  if (!result) {
    return null;
  }

  return {
    type: HandType.RoyalFlush,
    value: result.value,
    subvalue: result.subvalue,
    cards: result.cards,
    kickers: result.kickers,
  };
};

export default getRoyalFlush;
