import hasRoyalFlush from "../../../../../src/model/hand/detect/hasRoyalFlush";
import cards from "../../../../../src/model/card/cards";

describe("detect royal flushes", () => {
  test("detect a royal flush", () => {
    expect(hasRoyalFlush(cards("DA", "DK", "DQ", "DJ", "DT"))).toBe(true);
  });

  test("a non-suited high straight is not a royal flush", () => {
    expect(hasRoyalFlush(cards("DA", "DK", "DQ", "DJ", "HT"))).toBe(false);
  });
});
