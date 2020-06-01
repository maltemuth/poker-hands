import hasValueCount from "../../card/hasValueCount";
import sortedValues from "../../card/sortedValues";
import { Card } from "../../card/Card";

/**
 * returns true if a three-of-a-kind is contained within the given cards
 * @param cards
 */
const hasThreeOfAKind = (
  cards: Card[],
  presortedValues = sortedValues(cards)
) => hasValueCount(cards, 3, 1, presortedValues);

export default hasThreeOfAKind;
