import toString from "../../card/toString";
import { Card } from "../../card/Card";

/**
 * the list of all 4 royal flushes
 */
const royalFlushes = [
  ["Ad", "Kd", "Qd", "Jd", "Td"],
  ["Ac", "Kc", "Qc", "Jc", "Tc"],
  ["As", "Ks", "Qs", "Js", "Ts"],
  ["Ah", "Kh", "Qh", "Jh", "Th"],
];

/**
 * returns true if a royal flush is contained within the given cards
 * @param cards
 */
const hasRoyalFlush = (cards: Card[]): boolean => {
  if (cards.length < 5) return false;

  const cardsAsString = cards.map(toString);

  return royalFlushes.some((royalFlush) =>
    royalFlush.every((royalFlushCard) => cardsAsString.includes(royalFlushCard))
  );
};

export default hasRoyalFlush;
