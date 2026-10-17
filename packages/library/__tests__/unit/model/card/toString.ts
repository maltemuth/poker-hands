import assert from "node:assert/strict";
import { describe, it } from "node:test";
import toString from "../../../../src/model/card/toString.js";
import { Suit, Value } from "../../../../src/model/card/Card.js";

describe("convert cards to string", () => {
  it("ace of spades", () => {
    assert.deepEqual(
      toString({
        suit: Suit.spades,
        value: Value.ace,
      }),
      "As"
    );
  });

  it("4 of diamonds", () => {
    assert.deepEqual(
      toString({
        suit: Suit.diamonds,
        value: Value.four,
      }),
      "4d"
    );
  });
});
