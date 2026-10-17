import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertMatchObject } from "../../../helpers/assert.js";
import cards from "../../../../src/model/card/cards.js";
import odds from "../../../../src/model/odds/odds.js";
import percentages from "../../../../src/model/odds/percentages.js";

// with all five board cards known, exactly one board remains to be evaluated
describe("complete board", () => {
  it("odds: higher leading kicker wins regardless of trailing cards", () => {
    // AK875 vs A9875 -- the king decides, the lower cards must not matter
    const results = odds(
      [cards("As", "Kd"), cards("Ah", "9c")],
      cards("8c", "7d", "5h", "3s", "2c")
    );

    assertMatchObject(results[0], { wins: 1, ties: 0, winChance: 1 });
    assertMatchObject(results[1], { wins: 0, ties: 0, winChance: 0 });
  });

  it("odds: split pot is a tie for both", () => {
    const results = odds(
      [cards("As", "2d"), cards("Ah", "3c")],
      cards("Kc", "Qd", "Jh", "Ts", "9c")
    );

    results.forEach((result) =>
      assertMatchObject(result, { wins: 0, ties: 1, tieChance: 1 })
    );
  });

  it("odds: high cards that don't play don't break a tie", () => {
    // both play A K Q J 9; the 7 and the 6 are the sixth-best cards
    const results = odds(
      [cards("7h", "2c"), cards("6d", "3s")],
      cards("As", "Kd", "Qc", "Jh", "9s")
    );

    results.forEach((result) =>
      assertMatchObject(result, { wins: 0, ties: 1, tieChance: 1 })
    );
  });

  it("odds: the better made hand wins", () => {
    const holes = [cards("As", "Kd"), cards("Ah", "9c")];
    const board = cards("8c", "7d", "5h", "3s", "2c");

    assert.equal(odds(holes, board)[0].winChance, 1);
  });

  it("percentages: the made hand has a percentage of 1", () => {
    const result = percentages(
      cards("Ah", "Kh"),
      cards("Qh", "Jh", "Th", "2c", "3d")
    );

    assert.deepEqual(result.royalFlush, { count: 1, percentage: 1 });
    assert.deepEqual(result.highCard, { count: 0, percentage: 0 });
  });
});
