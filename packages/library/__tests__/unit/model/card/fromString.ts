import fromString from "../../../../src/model/card/fromString.js";
import { Suit, Value } from "../../../../src/model/card/Card.js";

describe("convert strings to cards", () => {
  test("ace of spades", () => {
    expect(fromString("As")).toEqual({
      suit: Suit.spades,
      value: Value.ace,
    });
  });
});
