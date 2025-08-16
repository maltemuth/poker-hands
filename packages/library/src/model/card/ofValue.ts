import { Card, Value } from "./Card";

const ofValue = (haystack: Card[], needle: Value): Card[] =>
  haystack.filter(({ value }) => value === needle);

export default ofValue;
