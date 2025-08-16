import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import getStraight from "./getStraight";
import purify from "../../../lib/purify";

const getStraightFlush = (
  cards: Card[]
): Hand<HandType.StraightFlush> | null => {
  const straight = purify(() => {
    const cardsBySuit: Record<string, Card[]> = cards.reduce((bySuit, card) => {
      bySuit[card.suit] = bySuit[card.suit] || [];
      bySuit[card.suit].push(card);

      return bySuit;
    }, {} as Record<string, Card[]>);

    const flushCandidate = Object.values(cardsBySuit).filter(
      (candidate) => candidate.length >= 5
    )[0];

    return getStraight(flushCandidate);
  });

  const straightResult = straight();
  if (!straightResult) {
    return null;
  }

  return {
    type: HandType.StraightFlush,
    cards: purify(() => straightResult.cards()),
    value: purify(() => straightResult.value()),
    kickers: () => [],
    subvalue: () => null,
  };
};

export default getStraightFlush;
