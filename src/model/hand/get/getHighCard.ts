import { Card } from "../../card/Card";
import { HandType } from "../Hand";
import hasHighCard from "../detect/hasHighCard";
import sortByValue from "../../card/sortByValue";
import { HandGetter } from "./HandGetter";

const getHighCard: HandGetter<HandType.HighCard> = (cards: Card[]) => {
  if (!hasHighCard(cards)) return null;

  const [highCard, ...kickers] = sortByValue(cards).reverse();

  return {
    type: HandType.HighCard,
    value: () => highCard.value,
    subvalue: () => null,
    cards: () => [highCard],
    kickers: () => kickers,
  };
};

export default getHighCard;
