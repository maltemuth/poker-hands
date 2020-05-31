import { HandDetector } from "./HandDetector";

/**
 * returns true if a flush is contained within the given cards
 * @param cards
 */
const hasFlush: HandDetector = (cards, _) => {
  const suits = cards.map(({ suit }) => suit);

  /**
   * an object with suits as keys, where the corresponding value counts how often the suit is repeated
   * in the cards
   */
  const suitCounts = suits.reduce((counts, suit) => {
    counts[suit] = counts[suit] + 1 || 1;
    return counts;
  }, {});
  return Object.values(suitCounts).some((value) => value >= 5);
};

export default hasFlush;
