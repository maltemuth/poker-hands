import hasValueCount from "../../card/hasValueCount";
import sortedValues from "../../card/sortedValues";
import { Card } from "../../card/Card";

/**
 * returns true if a full house is contained within the given cards
 * @param cards
 */
const hasFullHouse = (cards: Card[], presortedValues = sortedValues(cards)) =>
  hasValueCount(cards, 3, 1, presortedValues) &&
  hasValueCount(cards, 2, 2, presortedValues);

export default hasFullHouse;
