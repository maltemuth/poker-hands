import { Suit } from "./Card";

const allowedSuits = Object.values(Suit);

/**
 * returns true if the given string maps to a valid suit
 * @param candidate
 */
const isValidSuit = (candidate: string): candidate is Suit => {
  return allowedSuits.includes(candidate as Suit);
};

export default isValidSuit;
