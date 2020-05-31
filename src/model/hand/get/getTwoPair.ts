import { Card } from "../../card/Card";
import { Hand, HandType } from "../Hand";
import hasTwoPair from "../detect/hasTwoPair";
import getPair from "./getPair";
import without from "../../card/without";
import getKickers from "../getKickers";

const getTwoPair = (cards: Card[]): Hand<HandType.TwoPair> | null => {
  if (!hasTwoPair(cards)) return null;

  const firstPair = getPair(cards);
  const remainingCards = without(cards, ...firstPair.cards);
  const secondPair = getPair(remainingCards);
  const twoPair = [...firstPair.cards, ...secondPair.cards];
  const kickers = getKickers(cards, twoPair);

  return {
    type: HandType.TwoPair,
    cards: twoPair,
    value: firstPair.cards[0].value,
    subvalue: secondPair.cards[0].value,
    kickers,
  };
};

export default getTwoPair;
