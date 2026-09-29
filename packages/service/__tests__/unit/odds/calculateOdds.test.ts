import calculateOdds from "../../../src/odds/calculateOdds.js";

describe("calculateOdds", () => {
  it("calculates exact odds for a known river", () => {
    const result = calculateOdds({
      holes: [
        ["As", "Kd"],
        ["Ah", "9c"],
      ],
      board: ["8c", "7d", "5h", "3s", "2c"],
    });

    expect(result).toEqual({
      players: [
        { holeCards: ["As", "Kd"], winChance: 1, tieChance: 0 },
        { holeCards: ["Ah", "9c"], winChance: 0, tieChance: 0 },
      ],
    });
  });

  it("keeps the players in request order", () => {
    const result = calculateOdds({
      holes: [
        ["2c", "3d"],
        ["Ah", "As"],
        ["Kd", "Kh"],
      ],
      board: ["Ac", "Kc", "7h"],
    });

    expect(result.players.map((player) => player.holeCards)).toEqual([
      ["2c", "3d"],
      ["Ah", "As"],
      ["Kd", "Kh"],
    ]);
  });

  it("calculates exactly", () => {
    const result = calculateOdds({
      holes: [
        ["Ah", "As"],
        ["Kd", "Kh"],
      ],
      board: ["2c", "7d", "9h", "Jc"],
    });

    // 44 possible rivers
    expect(Number.isInteger(result.players[0].winChance * 44)).toBe(true);
    expect(Object.keys(result.players[0])).toEqual([
      "holeCards",
      "winChance",
      "tieChance",
    ]);
  });

  it("rejects duplicate cards", () => {
    expect(() =>
      calculateOdds({
        holes: [
          ["Ah", "As"],
          ["Ah", "Kh"],
        ],
      })
    ).toThrow();
  });
});
