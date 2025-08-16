import toString from "../../../../src/model/card/toString";
import { Suit, Value } from "../../../../src/model/card/Card";

describe("convert cards to string", () => {
  test("ace of spades", () => {
    expect(
      toString({
        suit: Suit.spades,
        value: Value.ace,
      })
    ).toEqual("As");
  });

  test("4 of diamonds", () => {
    expect(
      toString({
        suit: Suit.diamonds,
        value: Value.four,
      })
    ).toEqual("4d");
  });
});
