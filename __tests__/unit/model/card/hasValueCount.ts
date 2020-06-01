import hasValueCount from "../../../../src/model/card/hasValueCount";
import cards from "../../../../src/model/card/cards";

describe("can detect value counts", () => {
  test("detects a value count of two", () => {
    expect(hasValueCount(cards("Ac", "Ad"), 2)).toBe(true);
  });
});
