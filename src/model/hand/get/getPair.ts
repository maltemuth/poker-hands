import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import hasPair from "../detect/hasPair";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";
import purify from "../../../lib/purify";
import { ValueCounts } from "../../card/valueCounts";

const getPair = (
  cards: Card[],
  precalculatedValueCounts: ValueCounts
): Hand<HandType.Pair> | null => {
  if (!hasPair(cards, precalculatedValueCounts)) return null;

  const pair = purify(() =>
    ofValue(
      cards,
      highestRepeatedValue(cards, 2, precalculatedValueCounts)
    ).slice(0, 2)
  );
  const kickers = purify(() => getKickers(cards, pair()));

  return {
    type: HandType.Pair,
    cards: pair,
    kickers,
    value: purify(() => pair()[0].value),
    subvalue: () => null,
  };
};

export default getPair;
