import { HandDetector } from "./HandDetector";
import hasValueCount from "../../card/hasValueCount";

/**
 * returns true if a four-of-a-kind is contained within the given cards
 * @param cards
 */
const hasFourOfAkind: HandDetector = (cards) => hasValueCount(cards, 4);

export default hasFourOfAkind;
