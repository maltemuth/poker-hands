import combinations from "../../../src/model/combinatorics/combinations";

describe("ordered combinations of a given length", () => {
  test("empty arrays do not have combinations", () => {
    expect(combinations([], 0)).toEqual([]);
  });

  test("combinations of length 1 are the items themselves", () => {
    expect(combinations([0, 1, 2], 1)).toEqual([[0], [1], [2]]);
  });

  test("combinations of maximum length are the items themselves", () => {
    expect(combinations([0, 1, 2], 3)).toEqual([[0, 1, 2]]);
  });

  test("combinations of length 2 out of 3 elements", () => {
    expect(combinations([0, 1, 2], 2)).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
  });

  test("combinations of length 3 out of 4 elements", () => {
    expect(combinations([0, 1, 2, 3], 3)).toEqual([
      [0, 1, 2],
      [0, 1, 3],
      [0, 2, 3],
      [1, 2, 3],
    ]);
  });

  test("combinations of length 3 out of 5 elements", () => {
    expect(combinations([0, 1, 2, 3, 4], 3)).toEqual([
      [0, 1, 2],
      [0, 1, 3],
      [0, 1, 4],
      [0, 2, 3],
      [0, 2, 4],
      [0, 3, 4],
      [1, 2, 3],
      [1, 2, 4],
      [1, 3, 4],
      [2, 3, 4],
    ]);
  });

  test("combinations of length 2 out of 6 elements", () => {
    expect(combinations([0, 1, 2, 3, 4, 5], 2)).toEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 4],
      [2, 5],
      [3, 4],
      [3, 5],
      [4, 5],
    ]);
  });
});
