import { Card, Value } from "../../card/Card";
import { HandType } from "../Hand";
import hasStraight from "../detect/hasStraight";
import sortByValue from "../../card/sortByValue";
import purify from "../../../lib/purify";
import { HandGetter } from "./HandGetter";
import sortedValues from "../../card/sortedValues";

const getStraight: HandGetter<HandType.Straight> = (
  cards: Card[],
  presortedValues = sortedValues(cards)
) => {
  if (!hasStraight(cards, presortedValues)) return null;

  const straight = purify(() => {
    const sortedCards = sortByValue(cards).reverse();
    const values: Value[] = [];
    const withoutDuplicateValues = sortedCards.filter((card) => {
      if (values.includes(card.value)) return false;
      values.push(card.value);
      return true;
    });

    const subsetsOfLength5 = withoutDuplicateValues.map((card, index, list) =>
      [0, 1, 2, 3, 4].map((shift) => {
        // edge case - if we started from 5 then the last card will be undefined, but if the first is an ace, we have a straight anyway
        if (
          shift === 4 &&
          card.value === Value.five &&
          list[0].value === Value.ace
        )
          return list[0];
        if (typeof list[index + shift] === "undefined") return null;
        if (card.value === list[index + shift].value + shift)
          return list[index + shift];
      })
    );

    const contiguousSubsetsOfLength5 = subsetsOfLength5
      .map((subset) => subset.filter((card) => card))
      .filter((subset) => subset.length === 5);

    return contiguousSubsetsOfLength5[0];
  });

  return {
    type: HandType.Straight,
    cards: purify(() => straight()),
    kickers: () => [],
    value: purify(() => straight()[0].value),
    subvalue: () => null,
  };
};

export default getStraight;
