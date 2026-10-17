import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertCloseTo } from "../../../helpers/assert.js";
import odds from "../../../../src/model/odds/odds.js";
import cards from "../../../../src/model/card/cards.js";
import type { Card } from "../../../../src/model/card/Card.js";

describe("odds", () => {
  it("counts every remaining board", () => {
    const holes = [cards("As", "Ks"), cards("2d", "3d")];
    const board = cards("4d", "5d", "6d");

    const result = odds(holes, board);

    // C(45, 2) = 990 boards, each one won by a hole or tied
    assert.equal(result[0].wins + result[0].ties + result[1].wins, 990);
    assert.deepEqual(result[0].hole, holes[0]);
    assert.deepEqual(result[1].hole, holes[1]);
    assertCloseTo(
      result[0].winChance + result[1].winChance + result[0].tieChance,
      1,
      10
    );
  });

  it("calculates pre-flop exactly, heads-up", () => {
    // C(48, 5) = 1,712,304 boards, the WebAssembly package's counts
    const [aces, kings] = odds([cards("Ah", "As"), cards("Kd", "Kc")]);

    assert.deepEqual([aces.wins, aces.ties], [1_388_072, 6_538]);
    assert.deepEqual([kings.wins, kings.ties], [317_694, 6_538]);
  });

  it("calculates pre-flop exactly, a single hole", () => {
    // C(50, 5) = 2,118,760 boards, the most any spot can have
    const [aces] = odds([cards("As", "Ah")]);

    assert.deepEqual([aces.wins, aces.ties, aces.winChance], [2_118_760, 0, 1]);
  });

  it("ignores the mode of earlier versions", () => {
    const holes = [cards("As", "Ah"), cards("Ks", "Kh")];
    const board = cards("2c", "7d", "9h");
    // JavaScript callers may still pass { mode: "monteCarlo" }
    const legacy = { mode: "monteCarlo", sampleSize: 10 } as object;

    assert.deepEqual(odds(holes, board, legacy), odds(holes, board));
  });

  for (const [label, holes, board, message] of [
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
  ] as [string, Card[][], Card[], RegExp][])
    it(`rejects ${label}`, () => {
      assert.throws(() => odds(holes, board), message);
    });
});
