import { Card } from "./Card";
import toString from "./toString";
import fromString from "./fromString";

const without = (cards: Card[], ...removables: Card[]): Card[] => {
  const cardString = cards.map(toString);
  const removableStrings = removables.map(toString);

  return cardString
    .filter((cardString) => !removableStrings.includes(cardString))
    .map(fromString);
};

export default without;
