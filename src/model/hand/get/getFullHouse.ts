import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasFullHouse from "../detect/hasFullHouse";
import getThreeOfAKind from "./getThreeOfAKind";
import without from "../../card/without";
import getPair from "./getPair";
import purify from "../../../lib/purify";

const getFullHouse = (cards: Card[]): Hand<HandType.FullHouse> | null => {
  if (!hasFullHouse(cards)) return null;

  const threeOfAKind = purify(() => getThreeOfAKind(cards));
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
