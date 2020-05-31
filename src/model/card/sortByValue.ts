import { Card } from "./Card";

const sortByValue = (cards: Card[]): Card[] => {
  return cards.sort((a, b) => a.value - b.value);
};

export default sortByValue;
