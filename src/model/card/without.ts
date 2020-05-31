import { Card } from "./Card";
import toString from "./toString";
import fromString from "./fromString";

const without = (cards: Card[], ...removables: Card[]): Card[] => {
  const cardStrings = cards.map(toString);
  const removableStrings = removables.map(toString);

  return removableStrings
    .reduce((rest, removable) => {
      const index = rest.indexOf(removable);
      if (index > -1) rest.splice(index, 1);
      return rest;
    }, cardStrings)
    .map(fromString);
};

export default without;
