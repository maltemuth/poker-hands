import assert from "node:assert/strict";
import { describe, it } from "node:test";
import cards from "../../../../src/model/card/cards.js";
import { Suit, Value } from "../../../../src/model/card/Card.js";

describe("convert a list of strings to cards", () => {
  it("convert 3 cards", () => {
    assert.deepEqual(cards("Qd", "3c", "As", "7h"), [
      {
        suit: Suit.diamonds,
        value: Value.queen,
      },
      {
        suit: Suit.clubs,
        value: Value.three,
      },
      {
        suit: Suit.spades,
        value: Value.ace,
      },
      {
        suit: Suit.hearts,
        value: Value.seven,
      },
    ]);
  });
});
