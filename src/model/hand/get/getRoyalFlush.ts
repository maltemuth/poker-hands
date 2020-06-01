import { Card } from "../../card/Card";
import { HandType } from "../Hand";
import hasRoyalFlush from "../detect/hasRoyalFlush";
import getStraightFlush from "./getStraightFlush";
import purify from "../../../lib/purify";
import valueCounts from "../../card/valueCounts";
import { HandGetter } from "./HandGetter";
import sortedValues from "../../card/sortedValues";
import sortedSuits from "../../card/sortedSuits";

const getRoyalFlush: HandGetter<HandType.RoyalFlush> = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  presortedSuits = sortedSuits(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
) => {
  if (!hasRoyalFlush(cards)) return null;

  const straightFlush = purify(() =>
    getStraightFlush(
      cards,
      presortedValues,
      presortedSuits,
      precalculatedValueCounts
    )
  );

  return {
    ...straightFlush(),
    type: HandType.RoyalFlush,
  };
};

export default getRoyalFlush;
