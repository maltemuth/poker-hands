import { Value, Card } from "./Card";
import valueCounts from "./valueCounts";

const highestRepeatedValue = (
  cards: Card[],
  repetitionCount: number
): Value => {
  const countedValues = valueCounts(cards);
  const repeatedValues = Object.keys(countedValues)
    .filter((key) => countedValues[key] >= repetitionCount)
    .map((value) => parseInt(value, 10))
    .sort((a, b) => b - a);
  return repeatedValues[0];
};

export default highestRepeatedValue;
