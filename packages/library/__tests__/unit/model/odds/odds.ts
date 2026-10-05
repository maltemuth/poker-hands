import odds from "../../../../src/model/odds/odds.js";
import exhaustive from "../../../../src/model/odds/exhaustive.js";
import cards from "../../../../src/model/card/cards.js";

describe("odds", () => {
  it("counts every remaining board", () => {
    const holes = [cards("As", "Ks"), cards("2d", "3d")];
    const board = cards("4d", "5d", "6d");

    const result = odds(holes, board);

    // C(45, 2) = 990 boards, each one won by a hole or tied
    expect(result[0].wins + result[0].ties + result[1].wins).toBe(990);
    expect(result[0].hole).toEqual(holes[0]);
    expect(result[1].hole).toEqual(holes[1]);
    expect(
      result[0].winChance + result[1].winChance + result[0].tieChance
    ).toBeCloseTo(1, 10);
  });

  it.each([
    // C(48, 5) = 1,712,304 boards
    ["heads-up", [cards("As", "Ah"), cards("Ks", "Kh")]],
    // C(50, 5) = 2,118,760 boards, the most any spot can have
    ["a single hole", [cards("As", "Ah")]],
  ])("calculates pre-flop exactly, %s", (_, holes) => {
    expect(odds(holes)).toEqual(exhaustive(holes));
  });

  it("ignores the mode of earlier versions", () => {
    const holes = [cards("As", "Ah"), cards("Ks", "Kh")];
    const board = cards("2c", "7d", "9h");
    // JavaScript callers may still pass { mode: "monteCarlo" }
    const legacy = { mode: "monteCarlo", sampleSize: 10 } as object;

    expect(odds(holes, board, legacy)).toEqual(exhaustive(holes, board));
  });

  it.each([
    [
      "a hole of one card",
      [cards("As", "Ah"), cards("Kd")],
      [],
      /Hole 2 must have 2 cards, but has 1/,
    ],
    [
      "a hole of three cards",
      [cards("As", "Ah", "Ad")],
      [],
      /Hole 1 must have 2 cards, but has 3/,
    ],
    [
      "a board of six cards",
      [cards("As", "Ah")],
      cards("2c", "3c", "4c", "5c", "6c", "7c"),
      /The board has 6 cards, at most 5/,
    ],
  ])("rejects %s", (_, holes, board, message) => {
    expect(() => odds(holes, board)).toThrow(message);
  });
});
