import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import getStraight from "./getStraight";
import purify from "../../../lib/purify";

const getStraightFlush = (
  cards: Card[]
): Hand<HandType.StraightFlush> | null => {
  const straight = purify(() => {
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

    return getStraight(flushCandidate);
  });

  return {
    type: HandType.StraightFlush,
    cards: purify(() => straight().cards()),
    value: purify(() => straight().value()),
    kickers: () => [],
    subvalue: () => null,
  };
};

export default getStraightFlush;
