import fromString from "./fromString";
import { Card } from "./Card";

/**
 * returns a list of cards that is represented by these strings, or throws an error if unable to
 * @param inputs
 */
const cards = (...inputs: string[]): Card[] => {
  return inputs.map(fromString);
};

export default cards;
