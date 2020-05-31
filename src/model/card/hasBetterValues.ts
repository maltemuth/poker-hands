import { Card, Value } from "./Card";

const sortedValues = (set: Card[]): Value[] =>
  set.map(({ value }) => value).sort((x, y) => y - x);

const hasBetterValues = (a: Card[], b: Card[]) => {
  const aValues = sortedValues(a);
  const bValues = sortedValues(b);

  return aValues.reduce(
    (better, value, index) => better || value > bValues[index],
    false
  );
};

export default hasBetterValues;
