import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import hasHighCard from "../detect/hasHighCard";
import sortByValue from "../../card/sortByValue";
import valueCounts, { ValueCounts } from "../../card/valueCounts";

const getHighCard = (
  cards: Card[],
  _: ValueCounts = valueCounts(cards)
): Hand<HandType.HighCard> | null => {
  if (!hasHighCard(cards, _)) return null;

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
