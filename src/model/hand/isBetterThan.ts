import { Hand } from "./Hand";

const isBetterThan = (a: Hand<any>, b: Hand<any>): boolean => {
  if (a.type > b.type) return true;
  if (a.type === b.type) {
    if (a.value > b.value) return true;
    if (a.value === b.value) {
      if (a.subvalue > b.subvalue) return true;
      return false;
    }
    return false;
  }
  return false;
};

export default isBetterThan;