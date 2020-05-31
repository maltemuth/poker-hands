import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import hasHighCard from "../detect/hasHighCard";
import sortByValue from "../../card/sortByValue";
import assertUnique from "../../card/assertUnique";

const getHighCard = (cards: Card[]): Hand<HandType.HighCard> | null => {
  if (!hasHighCard(cards)) return null;

  assertUnique(cards);

  const [highCard, ...kickers] = sortByValue(cards).reverse();

  return {
    type: HandType.HighCard,
    value: highCard.value,
    subvalue: null,
    cards: [highCard],
    kickers,
  };
};

export default getHighCard;
