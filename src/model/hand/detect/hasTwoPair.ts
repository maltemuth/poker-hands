import hasValueCount from "../../card/hasValueCount";
import sortedValues from "../../card/sortedValues";
import { Card } from "../../card/Card";

/**
 * returns true if two pairs are contained within the given cards
 * @param cards
 */
const hasTwoPair = (cards: Card[], presortedValues = sortedValues(cards)) =>
  hasValueCount(cards, 2, 2, presortedValues);

export default hasTwoPair;
