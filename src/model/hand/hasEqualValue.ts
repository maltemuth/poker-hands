import { Hand } from "./Hand";
import valueToString from "../card/valueToString";
import { Card } from "../card/Card";
import numericalSort from "../../lib/numericalSort";

const serializeValues = (cards: Card[]): string =>
  cards
    .map(({ value }) => value)
    .sort(numericalSort)
    .map(valueToString)
    .join("");

const hasEqualValue = (a: Hand<any>, b: Hand<any>): boolean => {
  if (a.type !== b.type) return false;
  if (a.value() !== b.value()) return false;
  if (a.subvalue() !== b.subvalue()) return false;
  if (serializeValues(a.cards()) !== serializeValues(b.cards())) return false;
  if (serializeValues(a.kickers()) !== serializeValues(b.kickers()))
    return false;
  return true;
};

export default hasEqualValue;
