import { Card } from "../../card/Card";
import { HandType, Hand } from "../Hand";
import hasPair from "../detect/hasPair";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";

const getPair = (cards: Card[]): Hand<HandType.Pair> | null => {
  if (!hasPair(cards)) return null;

  const pair = ofValue(cards, highestRepeatedValue(cards, 2)).slice(0, 2);
  const kickers = getKickers(cards, pair);

  return {
    type: HandType.Pair,
    cards: pair,
    kickers,
    value: pair[0].value,
    subvalue: null,
  };
};

export default getPair;
