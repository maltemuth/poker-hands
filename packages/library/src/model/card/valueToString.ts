import { Value, ValueAsString } from "./Card.js";

/**
 * returns a string representing the given value
 * @param value
 */
const valueToString = (value: Value): string => {
  const valueKey = Object.keys(Value).find(
    (key) => Value[key as keyof typeof Value] === value
  );
  if (!valueKey) {
    throw new Error(
      `Could not convert value ${value} to a string representation.`
    );
  }
  return ValueAsString[valueKey as keyof typeof ValueAsString];
};

export default valueToString;
