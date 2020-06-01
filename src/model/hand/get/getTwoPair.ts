import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasTwoPair from "../detect/hasTwoPair";
import getPair from "./getPair";
import without from "../../card/without";
import getKickers from "../getKickers";
import purify from "../../../lib/purify";
import valueCounts, { ValueCounts } from "../../card/valueCounts";
import { HandGetter } from "./HandGetter";
import sortedValues from "../../card/sortedValues";
import sortedSuits from "../../card/sortedSuits";

const getTwoPair: HandGetter<HandType.TwoPair> = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  presortedSuits = sortedSuits(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
) => {
  if (!hasTwoPair(cards, presortedValues)) return null;

  const firstPair = purify(() =>
    getPair(cards, presortedValues, presortedSuits, precalculatedValueCounts)
  );
  const remainingCards = purify(() => without(cards, ...firstPair().cards()));
  const secondPair = purify(() => getPair(remainingCards()));
  const twoPair = purify(() => [
    ...firstPair().cards(),
    ...secondPair().cards(),
  ]);
  const kickers = purify(() => getKickers(cards, twoPair()));

  return {
    type: HandType.TwoPair,
    cards: twoPair,
    value: purify(() => firstPair().cards()[0].value),
    subvalue: purify(() => secondPair().cards()[0].value),
    kickers,
  };
};

export default getTwoPair;
