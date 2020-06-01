import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import hasFlush from "../detect/hasFlush";
import sortByValue from "../../card/sortByValue";
import purify from "../../../lib/purify";
import sortedSuits from "../../card/sortedSuits";

const getFlush = (
  cards: Card[],
  presortedSuits = sortedSuits(cards)
): Hand<HandType.Flush> | null => {
  if (!hasFlush(cards, presortedSuits)) return null;

  const flush = purify(() => {
    const cardsBySuit: { [suit: string]: Card[] } = cards.reduce(
      (map, card) => {
        map[card.suit] = map[card.suit] || [];
        map[card.suit].push(card);

        return map;
      },
      {}
    );
    const candidates = Object.values(cardsBySuit)
      .filter((candidate) => candidate.length >= 5)
      .map(sortByValue)
      .map((candidate) => candidate.reverse())
      .map((candidate) => candidate.slice(0, 5));

    // with 7 cards, there can be at most one flush
    return candidates[0];
  });

  return {
    type: HandType.Flush,
    cards: flush,
    value: purify(() => flush()[0].value),
    subvalue: () => null,
    kickers: () => [],
  };
};

export default getFlush;
