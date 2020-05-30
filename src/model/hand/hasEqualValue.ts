import { Hand } from "./Hand";

const hasEqualValue = (a: Hand<any>, b: Hand<any>): boolean => {
    return a.type === b.type && a.value === b.value && a.subvalue === b.subvalue;
}

export default hasEqualValue;