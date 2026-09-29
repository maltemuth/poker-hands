import valueCounts from "../../../../src/model/card/valueCounts.js";
import cards from "../../../../src/model/card/cards.js";
import { Value } from "../../../../src/model/card/Card.js";

describe("count values in a list of cards", () => {
  test("three aces", () => {
    expect(valueCounts(cards("As", "Ah", "Ad"))).toEqual({
      [Value.ace]: 3,
    });
  });
});
