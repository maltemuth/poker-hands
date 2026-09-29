import { Card } from "./Card.js";
import isValidSuit from "./isValidSuit.js";
import valueFromString from "./valueFromString.js";

/**
 * returns a card represented by the given input string or throws an error if unable to
 * @param input
 */
const fromString = (input: string): Card => {
  const [stringValue, suit] = input.split("");

  const value = valueFromString(stringValue);

  if (isValidSuit(suit)) {
    return {
      suit,
      value,
    } as Card;
  } else {
    throw new Error(`Could not convert string ${input} to a card.`);
  }
};

export default fromString;
