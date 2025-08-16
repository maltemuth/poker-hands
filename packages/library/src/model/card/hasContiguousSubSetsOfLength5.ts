import numericalSort from "../../lib/numericalSort";
import { Value } from "./Card";

/**
 * returns true if the given values have subset of contiguous numbers of length 5
 * @param values
 */
const hasContiguousSubSetsOfLength5 = (
  values: number[],
  presortedValues: Value[] = values.sort(numericalSort)
): boolean =>
  presortedValues.some((value, index, list) =>
    [1, 2, 3, 4].every((shift) => list[index + shift] === value + shift)
  );

export default hasContiguousSubSetsOfLength5;
