import { Card } from "../../card/Card.js";
import { HandType, Hand } from "../Hand.js";
import ofValue from "../../card/ofValue.js";
import getKickers from "../getKickers.js";
import highestRepeatedValue from "../../card/highestRepeatedValue.js";
import purify from "../../../lib/purify.js";
import valueCounts from "../../card/valueCounts.js";
import sortedValues from "../../card/sortedValues.js";

const getFourOfAKind = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
): Hand<HandType.FourOfAKind> | null => {
  const highestValue = highestRepeatedValue(cards, 4, precalculatedValueCounts);
  if (!highestValue) return null;

  const fourOfAKind = purify(() => ofValue(cards, highestValue).slice(0, 4));
  const fourOfAKindCards = fourOfAKind();
  if (!fourOfAKindCards || fourOfAKindCards.length === 0) return null;

  const kickers = purify(() => getKickers(cards, fourOfAKind()));

  return {
    type: HandType.FourOfAKind,
    cards: fourOfAKind,
    kickers,
    value: purify(() => fourOfAKindCards[0].value),
    subvalue: () => null,
  };
};

export default getFourOfAKind;
