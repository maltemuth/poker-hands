import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import getStraightFlush from "./getStraightFlush";
import purify from "../../../lib/purify";

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
