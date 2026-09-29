import { Card } from "../../card/Card.js";
import { HandType, Hand } from "../Hand.js";
import ofValue from "../../card/ofValue.js";
import getKickers from "../getKickers.js";
import highestRepeatedValue from "../../card/highestRepeatedValue.js";
import purify from "../../../lib/purify.js";
import valueCounts from "../../card/valueCounts.js";
import sortedValues from "../../card/sortedValues.js";

const getThreeOfAKind = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
): Hand<HandType.ThreeOfAKind> | null => {
  const highestValue = highestRepeatedValue(cards, 3, precalculatedValueCounts);
  if (!highestValue) return null;

  const threeOfAKind = purify(() => ofValue(cards, highestValue).slice(0, 3));
  const threeOfAKindCards = threeOfAKind();
  if (!threeOfAKindCards || threeOfAKindCards.length === 0) return null;

  const kickers = purify(() => getKickers(cards, threeOfAKind()));

  return {
    type: HandType.ThreeOfAKind,
    cards: threeOfAKind,
    kickers,
    value: purify(() => threeOfAKindCards[0].value),
    subvalue: () => null,
  };
};

export default getThreeOfAKind;
