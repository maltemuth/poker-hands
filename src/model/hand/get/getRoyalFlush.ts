import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasRoyalFlush from "../detect/hasRoyalFlush";
import getStraightFlush from "./getStraightFlush";

const getRoyalFlush = (cards: Card[]): Hand<HandType.RoyalFlush> | null => {
  if (!hasRoyalFlush(cards)) return null;

  const straightFlush = getStraightFlush(cards);

  return {
    ...straightFlush,
    type: HandType.RoyalFlush,
  };
};

export default getRoyalFlush;
