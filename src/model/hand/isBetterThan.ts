import { Hand } from "./Hand";
import hasBetterValues from "../card/hasBetterValues";

const isBetterThan = (a: Hand<any>, b: Hand<any>): boolean => {
  if (a.type > b.type) return true;
  if (a.type === b.type) {
    if (a.value() > b.value()) return true;
    if (a.value() === b.value()) {
      if (a.subvalue() > b.subvalue()) return true;
      if (a.subvalue() === b.subvalue()) {
        // now, we actually have to compare card-by-card, since e.g. flushes are compared this way
        if (hasBetterValues(a.cards(), b.cards())) return true;
        if (hasBetterValues(a.kickers(), b.kickers())) return true;
        // if neither the cards nor the kickers can solve this, values are equal - and we return false
        return false;
      }
      return false;
    }
    return false;
  }
  return false;
};

export default isBetterThan;
