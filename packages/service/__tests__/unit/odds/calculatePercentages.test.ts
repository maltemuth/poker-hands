import assert from "node:assert/strict";
import { describe, it } from "node:test";
import calculatePercentages from "../../../src/odds/calculatePercentages.js";
import { PercentagesData } from "../../../src/types/index.js";

const totalCount = (percentages: PercentagesData) =>
  Object.values(percentages).reduce((sum, { count }) => sum + count, 0);

describe("calculatePercentages", () => {
  it("calculates the hand types of a single player", () => {
    const result = calculatePercentages({
      holes: [["Ah", "Kh"]],
      board: ["Qh", "Jh", "Th", "2c", "3d"],
    });

    assert.equal(result.players.length, 1);
    assert.deepEqual(result.players[0].holeCards, ["Ah", "Kh"]);
    assert.deepEqual(result.players[0].percentages.royalFlush, {
      count: 1,
      percentage: 1,
    });
  });

  it("treats the other players' cards as dead", () => {
    const result = calculatePercentages({
      holes: [
        ["Ah", "Kh"],
        ["Th", "9c"],
      ],
      board: ["Qh", "Jh", "2c", "3d"],
    });

    const [first, second] = result.players;
    // 52 cards minus 4 hole cards and 4 board cards
    assert.equal(totalCount(first.percentages), 44);
    assert.equal(totalCount(second.percentages), 44);
    // the only card completing the royal flush is in the second player's hand
    assert.equal(first.percentages.royalFlush.count, 0);
  });

  it("keeps the players in request order", () => {
    const result = calculatePercentages({
      holes: [
        ["2c", "3d"],
        ["Ah", "As"],
      ],
      board: ["Kc", "Qd", "7h", "5s"],
    });

    assert.deepEqual(
      result.players.map((player) => player.holeCards),
      [
        ["2c", "3d"],
        ["Ah", "As"],
      ]
    );
  });

  it("rejects duplicate cards", () => {
    assert.throws(() =>
      calculatePercentages({
        holes: [
          ["Ah", "As"],
          ["Ah", "Kh"],
        ],
        board: ["2c", "3d", "4h"],
      })
    );
  });
});
