import { HandDetector } from "./HandDetector";

/**
 * returns true if a high card is contained within the given cards,
 * i.e. if at least one card was given
 * @param cards
 */
const hasHighCard: HandDetector = (cards) => cards.length > 0;

export default hasHighCard;
