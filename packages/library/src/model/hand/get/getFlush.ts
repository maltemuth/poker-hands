import { Card } from "../../card/Card.js";
import { HandType, Hand } from "../Hand.js";
import sortByValue from "../../card/sortByValue.js";
import purify from "../../../lib/purify.js";

const getFlush = (cards: Card[]): Hand<HandType.Flush> | null => {
  const flush = purify(() => {
    const cardsBySuit: Record<string, Card[]> = cards.reduce((map, card) => {
      map[card.suit] = map[card.suit] || [];
      map[card.suit].push(card);

      return map;
    }, {} as Record<string, Card[]>);
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
