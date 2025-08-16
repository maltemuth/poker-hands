import cards from "../../../../src/model/card/cards";
import { Suit, Value } from "../../../../src/model/card/Card";

describe("convert a list of strings to cards", () => {
  test("convert 3 cards", () => {
    expect(cards("Qd", "3c", "As", "7h")).toEqual([
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
