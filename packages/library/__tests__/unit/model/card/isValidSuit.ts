import assert from "node:assert/strict";
import { describe, it } from "node:test";
import isValidSuit from "../../../../src/model/card/isValidSuit.js";

describe("detecting valid suits", () => {
  it("valid suit", () => {
    assert.equal(isValidSuit("c"), true);
  });
  it("invalid suit", () => {
    assert.equal(isValidSuit("x"), false);
  });
});
