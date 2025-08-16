import { Value, Card } from "./Card";
import valueCounts from "./valueCounts";

const highestRepeatedValue = (
  cards: Card[],
  repetitionCount: number,
  precalculatedValueCounts = valueCounts(cards)
): Value | null => {
  const repeatedValues = Object.keys(precalculatedValueCounts)
    .filter(
      (key) =>
        precalculatedValueCounts[key as unknown as Value] >= repetitionCount
    )
    .map((value) => parseInt(value, 10))
    .sort((a, b) => b - a);
  return repeatedValues[0] || null;
};

export default highestRepeatedValue;
