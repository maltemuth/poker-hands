import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasFullHouse from "../detect/hasFullHouse";
import getThreeOfAKind from "./getThreeOfAKind";
import without from "../../card/without";
import getPair from "./getPair";
import purify from "../../../lib/purify";
import valueCounts from "../../card/valueCounts";
import sortedValues from "../../card/sortedValues";
import sortedSuits from "../../card/sortedSuits";

const getFullHouse = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  presortedSuits = sortedSuits(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
): Hand<HandType.FullHouse> | null => {
  if (!hasFullHouse(cards, presortedValues)) return null;

  const threeOfAKind = purify(() =>
    getThreeOfAKind(
      cards,
      presortedValues,
      presortedSuits,
      precalculatedValueCounts
    )
  );
  const remainingCards = purify(() =>
    without(cards, ...threeOfAKind().cards())
  );
  const pair = purify(() => getPair(remainingCards()));
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
