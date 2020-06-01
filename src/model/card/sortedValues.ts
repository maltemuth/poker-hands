import { Value, Card } from "./Card";
import numericalSort from "../../lib/numericalSort";

const sortedValues = (cards: Card[]): Value[] =>
  cards.map(({ value }) => value).sort(numericalSort);

export default sortedValues;
