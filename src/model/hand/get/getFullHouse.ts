import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasFullHouse from "../detect/hasFullHouse";
import getThreeOfAKind from "./getThreeOfAKind";
import without from "../../card/without";
import getPair from "./getPair";

const getFullHouse = (cards: Card[]): Hand<HandType.FullHouse> | null => {
  if (!hasFullHouse(cards)) return null;

  const threeOfAKind = getThreeOfAKind(cards);
  const remainingCards = without(cards, ...threeOfAKind.cards);
  const pair = getPair(remainingCards);
  const fullHouse = [...threeOfAKind.cards, ...pair.cards];

  return {
    type: HandType.FullHouse,
    cards: fullHouse,
    kickers: [],
    value: threeOfAKind.cards[0].value,
    subvalue: pair.cards[0].value,
  };
};

export default getFullHouse;
