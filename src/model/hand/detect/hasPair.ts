import { HandDetector } from "./HandDetector";
import hasValueCount from "../../card/hasValueCount";

/**
 * returns true if a pair is contained within the given cards
 * @param cards
 */
const hasPair: HandDetector = (cards) => hasValueCount(cards, 2);

export default hasPair;
