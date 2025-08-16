import { Card } from "./Card";
import valueCounts from "./valueCounts";
import numericalSort from "../../lib/numericalSort";

const sortValueCounts = (cards: Card[]): number[] =>
  Object.values(valueCounts(cards)).sort(numericalSort).reverse();

export default sortValueCounts;
