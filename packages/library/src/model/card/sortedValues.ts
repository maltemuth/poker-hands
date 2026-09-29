import { Value, Card } from "./Card.js";
import numericalSort from "../../lib/numericalSort.js";

const sortedValues = (cards: Card[]): Value[] =>
  cards.map(({ value }) => value).sort(numericalSort);

export default sortedValues;
