import cards from "../../../../src/model/card/cards";
import percentages from "../../../../src/model/odds/percentages";

describe("percentages", () => {
  test("counts every possible board once", () => {
    // 46 possible rivers
    const result = percentages(
      cards("Ah", "Kh"),
      cards("Qh", "Jh", "2c", "3d")
    );

    const total = Object.values(result).reduce(
      (sum, { count }) => sum + count,
      0
    );
    expect(total).toBe(46);
    expect(result.royalFlush.count).toBe(1);
  });

  test("rejects a card that is both in the hole and on the board", () => {
    expect(() =>
      percentages(cards("Ah", "Kh"), cards("Ah", "Jh", "2c"))
    ).toThrow("Duplicates found");
  });

  test("rejects a card that appears twice on the board", () => {
    expect(() =>
      percentages(cards("Ah", "Kh"), cards("Qh", "Qh", "2c"))
    ).toThrow("Duplicates found");
  });
});
