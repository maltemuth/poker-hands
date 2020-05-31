import { Hand } from "./Hand";
import isBetterThan from "./isBetterThan";

const hasEqualValue = (a: Hand<any>, b: Hand<any>): boolean =>
  !isBetterThan(a, b) && !isBetterThan(b, a);

export default hasEqualValue;
