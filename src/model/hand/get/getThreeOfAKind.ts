import { Card } from "../../card/Card";
import { HandType } from "../Hand";
import hasThreeOfAKind from "../detect/hasThreeOfAKind";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";
import purify from "../../../lib/purify";
import valueCounts from "../../card/valueCounts";
import { HandGetter } from "./HandGetter";
import sortedValues from "../../card/sortedValues";

const getThreeOfAKind: HandGetter<HandType.ThreeOfAKind> = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  _,
  precalculatedValueCounts = valueCounts(cards, presortedValues)
) => {
  if (!hasThreeOfAKind(cards, presortedValues)) return null;

  const threeOfAKind = purify(() =>
    ofValue(
      cards,
      highestRepeatedValue(cards, 3, precalculatedValueCounts)
    ).slice(0, 3)
  );
  const kickers = purify(() => getKickers(cards, threeOfAKind()));

  return {
    type: HandType.ThreeOfAKind,
    cards: threeOfAKind,
    kickers,
    value: purify(() => threeOfAKind()[0].value),
    subvalue: () => null,
  };
};

export default getThreeOfAKind;
