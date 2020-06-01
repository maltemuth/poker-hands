import hasValueCount from "../../card/hasValueCount";
import sortedValues from "../../card/sortedValues";
import { Card } from "../../card/Card";

/**
 * returns true if a four-of-a-kind is contained within the given cards
 * @param cards
 */
const hasFourOfAkind = (cards: Card[], presortedValues = sortedValues(cards)) =>
  hasValueCount(cards, 4, 1, presortedValues);

export default hasFourOfAkind;
