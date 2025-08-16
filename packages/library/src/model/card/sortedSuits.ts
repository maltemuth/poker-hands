import { Card, Suit } from "./Card";

const sortedSuits = (cards: Card[]): Suit[] =>
  cards.map(({ suit }) => suit).sort();

export default sortedSuits;
