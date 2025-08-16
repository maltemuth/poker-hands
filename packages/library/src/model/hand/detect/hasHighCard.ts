import { Card } from "../../card/Card";

/**
 * returns true if a high card is contained within the given cards,
 * i.e. if at least one card was given
 * @param cards
 */
const hasHighCard = (cards: Card[]) => cards.length > 0;

export default hasHighCard;
