import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasRoyalFlush from "../detect/hasRoyalFlush";
import getStraightFlush from "./getStraightFlush";
import purify from "../../../lib/purify";
import valueCounts, { ValueCounts } from "../../card/valueCounts";

const getRoyalFlush = (
  cards: Card[],
  _: ValueCounts = valueCounts(cards)
): Hand<HandType.RoyalFlush> | null => {
  if (!hasRoyalFlush(cards, _)) return null;

  const straightFlush = purify(() => getStraightFlush(cards, _));

  return {
    ...straightFlush(),
    type: HandType.RoyalFlush,
  };
};

export default getRoyalFlush;
