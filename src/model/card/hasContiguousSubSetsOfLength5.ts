/**
 * returns true if the given values have subset of contiguous numbers of length 5
 * @param values
 */
const hasContiguousSubSetsOfLength5 = (values: number[]): boolean =>
  values
    .sort()
    .filter(
      (value, index, list) =>
        [1, 2, 3, 4].filter((shift) => list[index + shift] === value + shift)
          .length === 4
    ).length >= 1;

export default hasContiguousSubSetsOfLength5;
