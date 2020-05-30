import { HandDetector } from "./HandDetector";

import hasValueCount from "../../card/hasValueCount";

/**
 * returns true if a full house is contained within the given cards
 * @param cards
 */
const hasFullHouse: HandDetector = (cards) =>
  hasValueCount(cards, 3, 1) && hasValueCount(cards, 2, 2);

export default hasFullHouse;
