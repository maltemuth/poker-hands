import hasStraightFlush from "../../../../../src/model/hand/detect/hasStraightFlush";
import cards from "../../../../../src/model/card/cards";

describe("detect straights", () => {
  test("four cards are not a straight", () => {
    expect(hasStraightFlush(cards("2d", "3d", "4d", "5d"))).toBe(false);
  });

  test("detect a straight flush", () => {
    expect(hasStraightFlush(cards("2d", "3d", "4d", "5d", "6d"))).toBe(true);
  });

  test("a non-suited straight is not a straight flush", () => {
    expect(hasStraightFlush(cards("2c", "3d", "4d", "5d", "6d"))).toBe(false);
  });

  test("detect a straight flush starting from ace", () => {
    expect(hasStraightFlush(cards("Ad", "2d", "3d", "4d", "5d"))).toBe(true);
  });

  test("detect a straight flush from seven cards, out of order", () => {
    expect(
      hasStraightFlush(cards("8d", "7d", "4d", "5d", "6d", "2h", "9c"))
    ).toBe(true);
  });
});
