import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";
import purify from "../../../lib/purify";
import valueCounts from "../../card/valueCounts";
import sortedValues from "../../card/sortedValues";

const getPair = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
): Hand<HandType.Pair> | null => {
  const highestValue = highestRepeatedValue(cards, 2, precalculatedValueCounts);
  if (!highestValue) return null;

  const pair = purify(() => ofValue(cards, highestValue).slice(0, 2));
  const pairCards = pair();
  if (!pairCards || pairCards.length === 0) return null;

  const kickers = purify(() => getKickers(cards, pair()));

  return {
    type: HandType.Pair,
    cards: pair,
    kickers,
    value: purify(() => pairCards[0].value),
    subvalue: () => null,
  };
};

export default getPair;
