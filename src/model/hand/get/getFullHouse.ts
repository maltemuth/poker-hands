import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasFullHouse from "../detect/hasFullHouse";
import getThreeOfAKind from "./getThreeOfAKind";
import without from "../../card/without";
import getPair from "./getPair";
import purify from "../../../lib/purify";
import valueCounts, { ValueCounts } from "../../card/valueCounts";

const getFullHouse = (
  cards: Card[],
  precalculatedValueCounts: ValueCounts = valueCounts(cards)
): Hand<HandType.FullHouse> | null => {
  if (!hasFullHouse(cards, precalculatedValueCounts)) return null;

  const threeOfAKind = purify(() =>
    getThreeOfAKind(cards, precalculatedValueCounts)
  );
  const remainingCards = purify(() =>
    without(cards, ...threeOfAKind().cards())
  );
  const pair = purify(() =>
    getPair(remainingCards(), valueCounts(remainingCards()))
  );
  const fullHouse = purify(() => [
    ...threeOfAKind().cards(),
    ...pair().cards(),
  ]);

  return {
    type: HandType.FullHouse,
    cards: fullHouse,
    kickers: () => [],
    value: purify(() => threeOfAKind().cards()[0].value),
    subvalue: purify(() => pair().cards()[0].value),
  };
};

export default getFullHouse;
