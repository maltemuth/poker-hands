import { Value, ValueAsString } from "./Card";

/**
 * returns a string representing the given value
 * @param value
 */
const valueToString = (value: Value): String => {
  const valueKey = Value[value];
  return ValueAsString[valueKey];
};

export default valueToString;
