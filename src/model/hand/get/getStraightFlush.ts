import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasStraightFlush from "../detect/hasStraightFlush";
import getStraight from "./getStraight";

const getStraightFlush = (
  cards: Card[]
): Hand<HandType.StraightFlush> | null => {
  if (!hasStraightFlush(cards)) return null;

  const cardsBySuit: { [suit: string]: Card[] } = cards.reduce(
    (bySuit, card) => {
      bySuit[card.suit] = bySuit[card.suit] || [];
      bySuit[card.suit].push(card);

      return bySuit;
    },
    {}
  );

  const flushCandidate = Object.values(cardsBySuit).filter(
    (candidate) => candidate.length >= 5
  )[0];

  const straight = getStraight(flushCandidate);

  return {
    type: HandType.StraightFlush,
    cards: straight.cards,
    value: straight.value,
    kickers: [],
    subvalue: null,
  };
};

export default getStraightFlush;
