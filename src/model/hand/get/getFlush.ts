import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import sortByValue from "../../card/sortByValue";
import purify from "../../../lib/purify";

const getFlush = (cards: Card[]): Hand<HandType.Flush> | null => {
  const flush = purify(() => {
    const cardsBySuit: { [suit: string]: Card[] } = cards.reduce(
      (map, card) => {
        map[card.suit] = map[card.suit] || [];
        map[card.suit].push(card);

        return map;
      },
      {}
    );
    const candidate = Object.values(cardsBySuit).filter(
      (candidate) => candidate.length >= 5
    )[0];

    const highestStraight = sortByValue(candidate).reverse().slice(0, 5);

    // with 7 cards, there can be at most one flush
    return highestStraight;
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
