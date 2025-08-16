import { Value, Card } from "../../card/Card";
import hasContiguousSubSetsOfLength5 from "../../card/hasContiguousSubSetsOfLength5";
import sortedValues from "../../card/sortedValues";

/**
 * returns true if a straight is contained within the given cards
 * @param cards
 */
const hasStraight = (
  cards: Card[],
  presortedValues = sortedValues(cards)
): boolean => {
  const values = presortedValues.filter(
    (value, index, list) => list.indexOf(value) === index
  );

  // straights can also start with an ace, which is the same as counting an ace as 1
  const valuesWithAceAsOne = values.map((value) =>
    value === Value.ace ? 1 : value
  );

  return (
    hasContiguousSubSetsOfLength5(values, presortedValues) ||
    hasContiguousSubSetsOfLength5(valuesWithAceAsOne)
  );
};

export default hasStraight;
