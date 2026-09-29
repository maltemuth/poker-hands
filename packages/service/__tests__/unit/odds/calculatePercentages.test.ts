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

    expect(result.players).toHaveLength(1);
    expect(result.players[0].holeCards).toEqual(["Ah", "Kh"]);
    expect(result.players[0].percentages.royalFlush).toEqual({
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
    expect(totalCount(first.percentages)).toBe(44);
    expect(totalCount(second.percentages)).toBe(44);
    // the only card completing the royal flush is in the second player's hand
    expect(first.percentages.royalFlush.count).toBe(0);
  });

  it("keeps the players in request order", () => {
    const result = calculatePercentages({
      holes: [
        ["2c", "3d"],
        ["Ah", "As"],
      ],
      board: ["Kc", "Qd", "7h", "5s"],
    });

    expect(result.players.map((player) => player.holeCards)).toEqual([
      ["2c", "3d"],
      ["Ah", "As"],
    ]);
  });

  it("rejects duplicate cards", () => {
    expect(() =>
      calculatePercentages({
        holes: [
          ["Ah", "As"],
          ["Ah", "Kh"],
        ],
        board: ["2c", "3d", "4h"],
      })
    ).toThrow();
  });
});
