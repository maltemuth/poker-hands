import cards from "../../../../src/model/card/cards";
import odds from "../../../../src/model/odds/odds";
import percentages from "../../../../src/model/odds/percentages";

// with all five board cards known, exactly one board remains to be evaluated
describe("complete board", () => {
  test("odds: higher leading kicker wins regardless of trailing cards", () => {
    // AK875 vs A9875 -- the king decides, the lower cards must not matter
    const results = odds(
      [cards("As", "Kd"), cards("Ah", "9c")],
      cards("8c", "7d", "5h", "3s", "2c")
    );

    expect(results[0]).toMatchObject({ wins: 1, ties: 0, winChance: 1 });
    expect(results[1]).toMatchObject({ wins: 0, ties: 0, winChance: 0 });
  });

  test("odds: split pot is a tie for both", () => {
    const results = odds(
      [cards("As", "2d"), cards("Ah", "3c")],
      cards("Kc", "Qd", "Jh", "Ts", "9c")
    );

    results.forEach((result) =>
      expect(result).toMatchObject({ wins: 0, ties: 1, tieChance: 1 })
    );
  });

  test("odds: works in every mode", () => {
    const holes = [cards("As", "Kd"), cards("Ah", "9c")];
    const board = cards("8c", "7d", "5h", "3s", "2c");

    expect(odds(holes, board, { mode: "exhaustive" })[0].winChance).toBe(1);
    expect(
      odds(holes, board, { mode: "monteCarlo", sampleSize: 10 })[0].winChance
    ).toBe(1);
  });

  test("percentages: the made hand has a percentage of 1", () => {
    const result = percentages(cards("Ah", "Kh"), cards("Qh", "Jh", "Th", "2c", "3d"));

    expect(result.royalFlush).toEqual({ count: 1, percentage: 1 });
    expect(result.highCard).toEqual({ count: 0, percentage: 0 });
  });
});
