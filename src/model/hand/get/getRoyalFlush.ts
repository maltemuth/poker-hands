import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasRoyalFlush from "../detect/hasRoyalFlush";
import assertUnique from "../../card/assertUnique";
import getStraightFlush from "./getStraightFlush";

const getRoyalFlush = (cards: Card[]): Hand<HandType.RoyalFlush> | null => {
  if (!hasRoyalFlush(cards)) return null;

  assertUnique(cards);

  const straightFlush = getStraightFlush(cards);

  return {
    ...straightFlush,
    type: HandType.RoyalFlush,
  };
};

export default getRoyalFlush;
