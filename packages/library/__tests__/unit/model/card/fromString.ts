import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fromString from "../../../../src/model/card/fromString.js";
import { Suit, Value } from "../../../../src/model/card/Card.js";

describe("convert strings to cards", () => {
  it("ace of spades", () => {
    assert.deepEqual(fromString("As"), {
      suit: Suit.spades,
      value: Value.ace,
    });
  });

  for (const input of ["", "A", "Ahx", "10h", "Ax"])
    it(`rejects ${JSON.stringify(input)}`, () => {
      assert.throws(() => fromString(input), /Could not convert/);
    });
});
