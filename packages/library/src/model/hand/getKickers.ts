import { Card } from "../card/Card.js";
import sortByValue from "../card/sortByValue.js";
import without from "../card/without.js";

const getKickers = (cards: Card[], usedCards: Card[]): Card[] =>
  sortByValue(without(cards, ...usedCards))
    .reverse()
    .slice(0, 5 - usedCards.length);

export default getKickers;
