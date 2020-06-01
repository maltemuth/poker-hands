import sortedSuits from "../../card/sortedSuits";
import { Card } from "../../card/Card";

/**
 * returns true if a flush is contained within the given cards
 * @param cards
 */
const hasFlush = (cards: Card[], _, presortedSuits = sortedSuits(cards)) => {
  const counts = {};

  for (let i = 0; i < presortedSuits.length; i++) {
    const suit = presortedSuits[i];
    counts[suit] = counts[suit] + 1 || 1;
    if (counts[suit] >= 5) return true;
  }
  return false;
};

export default hasFlush;
