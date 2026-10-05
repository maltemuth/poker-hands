import { ValueAsString, Value } from "./Card.js";

/** "2" to "A", in the order of the values 2 to 14 */
const strings: string[] = Object.values(ValueAsString);

/**
 * returns the value represented by the given string, or errors if unable to
 * @param input
 */
const valueFromString = (input: string): Value => {
  const index = strings.indexOf(input);
  if (index === -1) {
    throw new Error(`Could not convert string ${input} to a card value.`);
  }
  return index + 2;
};

export default valueFromString;
