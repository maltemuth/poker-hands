import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import sortByValue from "../../card/sortByValue";

const getHighCard = (cards: Card[]): Hand<HandType.HighCard> | null => {
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
