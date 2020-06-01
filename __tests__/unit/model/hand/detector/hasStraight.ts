import hasStraight from "../../../../../src/model/hand/detect/hasStraight";
import cards from "../../../../../src/model/card/cards";

describe("detect straights", () => {
  test("four cards are not a straight", () => {
    expect(hasStraight(cards("2d", "3d", "4d", "5d"))).toBe(false);
  });

  test("detect a straight", () => {
    expect(hasStraight(cards("Jh", "Th", "Qh", "8d", "9h"))).toBe(true);
  });

  test("detect a straight starting from ace", () => {
    expect(hasStraight(cards("Ad", "2d", "3d", "4d", "5d"))).toBe(true);
  });

  test("detect a straight from seven cards, out of order", () => {
    expect(hasStraight(cards("8d", "7d", "4d", "5d", "6d", "2h", "9c"))).toBe(
      true
    );
  });
});
