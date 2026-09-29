import { Card, Value } from "./Card.js";

const ofValue = (haystack: Card[], needle: Value): Card[] =>
  haystack.filter(({ value }) => value === needle);

export default ofValue;
