import assert from "node:assert/strict";
import { describe, it } from "node:test";
import valueFromString from "../../../../src/model/card/valueFromString.js";
import { Value } from "../../../../src/model/card/Card.js";

describe("reading values from strings", () => {
  it("valid values", () => {
    assert.deepEqual(valueFromString("J"), Value.jack);
  });
  it("invalid suit", () => {
    assert.throws(() => valueFromString("17"));
  });
  it("read a 10", () => {
    assert.deepEqual(valueFromString("T"), Value.ten);
  });
});
