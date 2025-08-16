import { Card } from "./Card";
import toString from "./toString";

const assertUnique = (cards: Card[]): void => {
  if (
    cards.map(toString).reduce<string[]>((unique, id) => {
      if (unique.includes(id)) return unique;
      return [...unique, id];
    }, []).length !== cards.length
  ) {
    throw new Error(`Duplicates found in card list '${cards.map(toString)}'`);
  }
};

export default assertUnique;
