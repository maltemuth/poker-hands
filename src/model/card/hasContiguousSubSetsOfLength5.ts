/**
 * returns true if the given values have subset of contiguous numbers of length 5
 * @param values
 */
const hasContiguousSubSetsOfLength5 = (values: number[]): boolean =>
  values
    .sort((a, b) => a - b)
    .some((value, index, list) =>
      [1, 2, 3, 4].every((shift) => list[index + shift] === value + shift)
    );

export default hasContiguousSubSetsOfLength5;
