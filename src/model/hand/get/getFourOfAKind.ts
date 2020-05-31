import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import ofValue from "../../card/ofValue";
import getKickers from "../getKickers";
import highestRepeatedValue from "../../card/highestRepeatedValue";
import hasFourOfAkind from "../detect/hasFourOfAKind";

const getFourOfAKind = (cards: Card[]): Hand<HandType.FourOfAKind> | null => {
  if (!hasFourOfAkind(cards)) return null;

  const fourOfAKind = ofValue(cards, highestRepeatedValue(cards, 4)).slice(
    0,
    4
  );
  const kickers = getKickers(cards, fourOfAKind);

  return {
    type: HandType.FourOfAKind,
    cards: fourOfAKind,
    kickers,
    value: fourOfAKind[0].value,
    subvalue: null,
  };
};

export default getFourOfAKind;
