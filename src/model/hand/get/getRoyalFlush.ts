import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import hasRoyalFlush from "../detect/hasRoyalFlush";
import getStraightFlush from "./getStraightFlush";
import purify from "../../../lib/purify";
import sortedValues from "../../card/sortedValues";
import sortedSuits from "../../card/sortedSuits";

const getRoyalFlush = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  presortedSuits = sortedSuits(cards)
): Hand<HandType.RoyalFlush> | null => {
  if (!hasRoyalFlush(cards)) return null;

  const straightFlush = purify(() =>
    getStraightFlush(cards, presortedValues, presortedSuits)
  );

  return {
    ...straightFlush(),
    type: HandType.RoyalFlush,
  };
};

export default getRoyalFlush;
