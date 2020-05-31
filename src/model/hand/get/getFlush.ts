import { Card, Value } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasFlush from "../detect/hasFlush";
import assertUnique from "../../card/assertUnique";
import sortByValue from "../../card/sortByValue";

const getFlush = (cards: Card[]): Hand<HandType.Flush> | null => {
  if (!hasFlush(cards)) return null;

  assertUnique(cards);

  const cardsBySuit: { [suit: string]: Card[] } = cards.reduce((map, card) => {
    map[card.suit] = map[card.suit] || [];
    map[card.suit].push(card);

    return map;
  }, {});
  const candidates = Object.values(cardsBySuit)
    .filter((candidate) => candidate.length >= 5)
    .map(sortByValue)
    .map((candidate) => candidate.reverse())
    .map((candidate) => candidate.slice(0, 5));

  // with 7 cards, there can be at most one flush
  const flush = candidates[0];

  return {
    type: HandType.Flush,
    cards: flush,
    value: flush[0].value,
    subvalue: null,
    kickers: [],
  };
};

export default getFlush;
