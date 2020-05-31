import { Value, Card } from "./Card";
import valueCounts from "./valueCounts";

const highestRepeatedValue = (
  cards: Card[],
  repetitionCount: number,
  precalculatedValueCounts = valueCounts(cards)
): Value => {
  const repeatedValues = Object.keys(precalculatedValueCounts)
    .filter((key) => precalculatedValueCounts[key] >= repetitionCount)
    .map((value) => parseInt(value, 10))
    .sort((a, b) => b - a);
  return repeatedValues[0];
};

export default highestRepeatedValue;
