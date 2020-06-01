import hasValueCount from "../../card/hasValueCount";
import sortedValues from "../../card/sortedValues";
import { Card } from "../../card/Card";

/**
 * returns true if a pair is contained within the given cards
 * @param cards
 */
const hasPair = (cards: Card[], presortedValues = sortedValues(cards)) =>
  hasValueCount(cards, 2, 1, presortedValues);

export default hasPair;
