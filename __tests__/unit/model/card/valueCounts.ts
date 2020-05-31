import valueCounts from "../../../../src/model/card/valueCounts";
import cards from "../../../../src/model/card/cards";
import { Value } from "../../../../src/model/card/Card";

describe("count values in a list of cards", () => {
  test("three aces", () => {
    expect(valueCounts(cards("SA", "HA", "DA"))).toEqual({
      [Value.ace]: 3,
    });
  });
});
