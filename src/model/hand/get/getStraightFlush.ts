import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import hasStraightFlush from "../detect/hasStraightFlush";
import getStraight from "./getStraight";
import purify from "../../../lib/purify";
import sortedSuits from "../../card/sortedSuits";
import sortedValues from "../../card/sortedValues";

const getStraightFlush = (
  cards: Card[],
  presortedValues = sortedValues(cards),
  presortedSuits = sortedSuits(cards)
): Hand<HandType.StraightFlush> | null => {
  if (!hasStraightFlush(cards, presortedValues, presortedSuits)) return null;

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
