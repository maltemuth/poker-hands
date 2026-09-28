import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import getPair from "./getPair";
import without from "../../card/without";
import getKickers from "../getKickers";
import purify from "../../../lib/purify";
import valueCounts from "../../card/valueCounts";
import sortedValues from "../../card/sortedValues";

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
