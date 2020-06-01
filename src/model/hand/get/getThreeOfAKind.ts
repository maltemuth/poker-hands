import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasThreeOfAKind from "../detect/hasThreeOfAKind";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";
import purify from "../../../lib/purify";
import valueCounts, { ValueCounts } from "../../card/valueCounts";

const getThreeOfAKind = (
  cards: Card[],
  precalculatedValueCounts: ValueCounts = valueCounts(cards)
): Hand<HandType.ThreeOfAKind> | null => {
  if (!hasThreeOfAKind(cards, precalculatedValueCounts)) return null;

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
