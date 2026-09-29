import { Card } from "../../card/Card.js";
import { Hand, HandType } from "../Hand.js";
import getPair from "./getPair.js";
import without from "../../card/without.js";
import getKickers from "../getKickers.js";
import purify from "../../../lib/purify.js";
import valueCounts from "../../card/valueCounts.js";
import sortedValues from "../../card/sortedValues.js";

const getTwoPair = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
): Hand<HandType.TwoPair> | null => {
  const firstPair = purify(() =>
    getPair(cards, presortedValues, precalculatedValueCounts)
  );

  if (!firstPair()) {
    return null;
  }

  const firstPairResult = firstPair();
  if (!firstPairResult) return null;

  const firstPairCards = firstPairResult.cards() || [];
  if (firstPairCards.length === 0) return null;

  const remainingCards = purify(() => without(cards, ...firstPairCards));
  const secondPair = purify(() => getPair(remainingCards()));

  if (!secondPair()) {
    return null;
  }

  const secondPairResult = secondPair();
  if (!secondPairResult) return null;

  const secondPairCards = secondPairResult.cards() || [];
  const twoPair = purify(() => [...firstPairCards, ...secondPairCards]);
  const kickers = purify(() => getKickers(cards, twoPair()));

  return {
    type: HandType.TwoPair,
    cards: twoPair,
    value: purify(() => firstPairCards[0].value),
    subvalue: purify(() => secondPairCards[0].value),
    kickers,
  };
};

export default getTwoPair;
