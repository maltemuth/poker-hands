import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import getStraightFlush from "./getStraightFlush";
import purify from "../../../lib/purify";

const getRoyalFlush = (cards: Card[]): Hand<HandType.RoyalFlush> | null => {
  const straightFlush = purify(() => getStraightFlush(cards));

  return {
    ...straightFlush(),
    type: HandType.RoyalFlush,
  };
};

export default getRoyalFlush;
