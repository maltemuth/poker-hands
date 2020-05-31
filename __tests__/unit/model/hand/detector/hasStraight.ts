import hasStraight from "../../../../../src/model/hand/detect/hasStraight";
import cards from "../../../../../src/model/card/cards";

describe("detect straights", () => {
  test("four cards are not a straight", () => {
    expect(hasStraight(cards("D2", "D3", "D4", "D5"))).toBe(false);
  });

  test("detect a straight", () => {
    expect(hasStraight(cards("HJ", "HT", "HQ", "D8", "H9"))).toBe(true);
  });

  test("detect a straight starting from ace", () => {
    expect(hasStraight(cards("DA", "D2", "D3", "D4", "D5"))).toBe(true);
  });

  test("detect a straight from seven cards, out of order", () => {
    expect(hasStraight(cards("D8", "D7", "D4", "D5", "D6", "H2", "C9"))).toBe(
      true
    );
  });
});
