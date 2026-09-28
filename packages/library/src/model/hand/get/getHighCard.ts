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
    // only the best five cards play: the high card and four kickers
    kickers: () => kickers.slice(0, 4),
  };
};

export default getHighCard;
