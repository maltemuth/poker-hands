import { Value, ValueAsString } from "./Card.js";

/** "2" to "A", in the order of the values 2 to 14 */
const strings: string[] = Object.values(ValueAsString);

/**
 * returns a string representing the given value
 * @param value
 */
const valueToString = (value: Value): string => {
  const string = strings[value - 2];
  if (string === undefined) {
    throw new Error(
      `Could not convert value ${value} to a string representation.`
    );
  }
  return string;
};

export default valueToString;
