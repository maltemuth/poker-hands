import assert from "node:assert/strict";
import { describe, it } from "node:test";
import valueToString from "../../../../src/model/card/valueToString.js";
import { Value } from "../../../../src/model/card/Card.js";

describe("convert card values to strings", () => {
  it("valid value", () => {
    assert.deepEqual(valueToString(Value.jack), "J");
  });

  it("valid number value", () => {
    assert.deepEqual(valueToString(Value.two), "2");
  });

  it("ace value", () => {
    assert.deepEqual(valueToString(Value.ace), "A");
  });

  for (const value of [1, 15])
    it(`rejects ${JSON.stringify(value)}`, () => {
      assert.throws(() => valueToString(value as Value), {
        message: `Could not convert value ${value} to a string representation.`,
      });
    });
});
