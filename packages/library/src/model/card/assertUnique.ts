import { Card } from "./Card.js";
import toString from "./toString.js";

const assertUnique = (cards: Card[]): void => {
  if (new Set(cards.map(toString)).size !== cards.length) {
    throw new Error(`Duplicates found in card list '${cards.map(toString)}'`);
  }
};

export default assertUnique;
