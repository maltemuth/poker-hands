import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import getThreeOfAKind from "./getThreeOfAKind";
import without from "../../card/without";
import getPair from "./getPair";
import purify from "../../../lib/purify";
import valueCounts from "../../card/valueCounts";
import sortedValues from "../../card/sortedValues";

const getFullHouse = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  precalculatedValueCounts = valueCounts(cards, presortedValues)
): Hand<HandType.FullHouse> | null => {
  const threeOfAKindResult = purify(() =>
    getThreeOfAKind(cards, presortedValues, precalculatedValueCounts)
  );

  if (!threeOfAKindResult()) return null;

  const threeOfAKindCards = threeOfAKindResult()?.cards() || [];
  if (threeOfAKindCards.length === 0) return null;

  const remainingCards = purify(() => without(cards, ...threeOfAKindCards));
  const pairResult = purify(() => getPair(remainingCards()));

  if (!pairResult()) return null;

  const pairCards = pairResult()?.cards() || [];
  if (pairCards.length === 0) return null;

  const fullHouse = purify(() => [...threeOfAKindCards, ...pairCards]);

  return {
    type: HandType.FullHouse,
    cards: fullHouse,
    kickers: () => [],
    value: purify(() => threeOfAKindCards[0].value),
    subvalue: purify(() => pairCards[0].value),
  };
};

export default getFullHouse;
