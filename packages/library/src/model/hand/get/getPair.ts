import { Card } from "../../card/Card.js";
import { HandType, Hand } from "../Hand.js";
import ofValue from "../../card/ofValue.js";
import getKickers from "../getKickers.js";
import highestRepeatedValue from "../../card/highestRepeatedValue.js";
import purify from "../../../lib/purify.js";
import valueCounts from "../../card/valueCounts.js";
import sortedValues from "../../card/sortedValues.js";

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
