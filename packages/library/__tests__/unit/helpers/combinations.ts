import assert from "node:assert/strict";
import { describe, it } from "node:test";
import combinations from "../../helpers/combinations.js";

describe("ordered combinations of a given length", () => {
  it("picking nothing yields exactly one empty combination", () => {
    assert.deepEqual(combinations([], 0), [[]]);
    assert.deepEqual(combinations([0, 1, 2], 0), [[]]);
  });

  it("combinations of length 1 are the items themselves", () => {
    assert.deepEqual(combinations([0, 1, 2], 1), [[0], [1], [2]]);
  });

  it("combinations of maximum length are the items themselves", () => {
    assert.deepEqual(combinations([0, 1, 2], 3), [[0, 1, 2]]);
  });

  it("combinations of length 2 out of 3 elements", () => {
    assert.deepEqual(combinations([0, 1, 2], 2), [
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
  });

  it("combinations of length 3 out of 4 elements", () => {
    assert.deepEqual(combinations([0, 1, 2, 3], 3), [
      [0, 1, 2],
      [0, 1, 3],
      [0, 2, 3],
      [1, 2, 3],
    ]);
  });

  it("combinations of length 3 out of 5 elements", () => {
    assert.deepEqual(combinations([0, 1, 2, 3, 4], 3), [
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

  it("combinations of length 2 out of 6 elements", () => {
    assert.deepEqual(combinations([0, 1, 2, 3, 4, 5], 2), [
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
