import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";
import hasFourOfAkind from "../detect/hasFourOfAKind";
import purify from "../../../lib/purify";
import { ValueCounts } from "../../card/valueCounts";

const getFourOfAKind = (
  cards: Card[],
  precalculatedValueCounts: ValueCounts
): Hand<HandType.FourOfAKind> | null => {
  if (!hasFourOfAkind(cards, precalculatedValueCounts)) return null;

  const fourOfAKind = purify(() =>
    ofValue(
      cards,
      highestRepeatedValue(cards, 4, precalculatedValueCounts)
    ).slice(0, 4)
  );
  const kickers = purify(() => getKickers(cards, fourOfAKind()));

  return {
    type: HandType.FourOfAKind,
    cards: fourOfAKind,
    kickers,
    value: purify(() => fourOfAKind()[0].value),
    subvalue: () => null,
  };
};

export default getFourOfAKind;
