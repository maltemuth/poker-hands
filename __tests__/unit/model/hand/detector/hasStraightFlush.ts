import hasStraightFlush from "../../../../../src/model/hand/detect/hasStraightFlush";
import cards from "../../../../../src/model/card/cards";

describe("detect straights", () => {
  test("four cards are not a straight", () => {
    expect(hasStraightFlush(cards("D2", "D3", "D4", "D5"))).toBe(false);
  });

  test("detect a straight flush", () => {
    expect(hasStraightFlush(cards("D2", "D3", "D4", "D5", "D6"))).toBe(true);
  });

  test("a non-suited straight is not a straight flush", () => {
    expect(hasStraightFlush(cards("C2", "D3", "D4", "D5", "D6"))).toBe(false);
  });

  test("detect a straight flush starting from ace", () => {
    expect(hasStraightFlush(cards("DA", "D2", "D3", "D4", "D5"))).toBe(true);
  });

  test("detect a straight flush from seven cards, out of order", () => {
    expect(
      hasStraightFlush(cards("D8", "D7", "D4", "D5", "D6", "H2", "C9"))
    ).toBe(true);
  });
});
