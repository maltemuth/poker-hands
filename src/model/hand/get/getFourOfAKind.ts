import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";
import hasFourOfAkind from "../detect/hasFourOfAKind";
import purify from "../../../lib/purify";
import valueCounts from "../../card/valueCounts";
import sortedValues from "../../card/sortedValues";
import sortedSuits from "../../card/sortedSuits";

const getFourOfAKind = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
): Hand<HandType.FourOfAKind> | null => {
  if (!hasFourOfAkind(cards, presortedValues)) return null;

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
