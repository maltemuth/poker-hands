import { HandDetector } from "./HandDetector";
import toString from "../../card/toString";

/**
 * the list of all 4 royal flushes
 */
const royalFlushes = [
  ["DA", "DK", "DQ", "DJ", "DT"],
  ["CA", "CK", "CQ", "CJ", "CT"],
  ["SA", "SK", "SQ", "SJ", "ST"],
  ["HA", "HK", "HQ", "HJ", "HT"],
];

/**
 * returns true if a royal flush is contained within the given cards
 * @param cards
 */
const hasRoyalFlush: HandDetector = (cards) => {
  if (cards.length < 5) return false;

  const cardsAsString = cards.map(toString);

  return (
    royalFlushes.filter(
      (royalFlush) =>
        royalFlush.filter((royalFlushCard) =>
          cardsAsString.includes(royalFlushCard)
        ).length === 5
    ).length >= 1
  );
};

export default hasRoyalFlush;