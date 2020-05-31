import fromString from "../../../../src/model/card/fromString";
import { Suit, Value } from "../../../../src/model/card/Card";

describe("convert strings to cards", () => {
  test("ace of spades", () => {
    expect(fromString("SA")).toEqual({
      suit: Suit.spades,
      value: Value.ace,
    });
  });
});
