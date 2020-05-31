import { Card } from "../card/Card";
import sortByValue from "../card/sortByValue";
import without from "../card/without";

const getKickers = (cards: Card[], usedCards: Card[]): Card[] =>
  sortByValue(without(cards, ...usedCards))
    .reverse()
    .slice(0, 5 - usedCards.length);

export default getKickers;
