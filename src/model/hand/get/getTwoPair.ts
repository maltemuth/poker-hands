import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasTwoPair from "../detect/hasTwoPair";
import getPair from "./getPair";
import without from "../../card/without";
import getKickers from "../getKickers";
import purify from "../../../lib/purify";
import valueCounts, { ValueCounts } from "../../card/valueCounts";

const getTwoPair = (
  cards: Card[],
  precalculatedValueCounts: ValueCounts
): Hand<HandType.TwoPair> | null => {
  if (!hasTwoPair(cards, precalculatedValueCounts)) return null;

  const firstPair = purify(() => getPair(cards, precalculatedValueCounts));
  const remainingCards = purify(() => without(cards, ...firstPair().cards()));
  const secondPair = purify(() =>
    getPair(remainingCards(), valueCounts(remainingCards()))
  );
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
