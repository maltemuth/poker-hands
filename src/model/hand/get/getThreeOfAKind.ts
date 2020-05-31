import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasThreeOfAKind from "../detect/hasThreeOfAKind";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";

const getThreeOfAKind = (cards: Card[]): Hand<HandType.ThreeOfAKind> | null => {
  if (!hasThreeOfAKind(cards)) return null;

  const threeOfAKind = ofValue(cards, highestRepeatedValue(cards, 3)).slice(
    0,
    3
  );
  const kickers = getKickers(cards, threeOfAKind);

  return {
    type: HandType.ThreeOfAKind,
    cards: threeOfAKind,
    kickers,
    value: threeOfAKind[0].value,
    subvalue: null,
  };
};

export default getThreeOfAKind;
