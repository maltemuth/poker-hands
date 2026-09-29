import { ValueAsString, Value } from "./Card.js";

const validStrings = Object.values(ValueAsString);

/**
 * returns the value represented by the given string, or errors if unable to
 * @param input
 */
const valueFromString = (input: string): Value => {
  if (!validStrings.includes(input as ValueAsString)) {
    throw new Error(`Could not convert string ${input} to a card value.`);
  }

  const valueKey = Object.keys(ValueAsString).find(
    (key) => ValueAsString[key as keyof typeof ValueAsString] === input
  );

  if (!valueKey) {
    throw new Error(`Could not convert string ${input} to a card value.`);
  }

  return Value[valueKey as keyof typeof Value];
};

export default valueFromString;
