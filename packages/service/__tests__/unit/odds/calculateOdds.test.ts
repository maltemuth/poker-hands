import calculateOdds from "../../../src/odds/calculateOdds";

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

  it("uses Monte Carlo with the requested sample size", () => {
    const result = calculateOdds({
      holes: [
        ["Ah", "As"],
        ["Kd", "Kh"],
      ],
      options: { mode: "monteCarlo", sampleSize: 200 },
    });

    expect(result.players[0].winChanceError).toBeGreaterThan(0);
    // with 200 samples, chances are multiples of 1/200
    expect(Number.isInteger(result.players[0].winChance * 200)).toBe(true);
  });

  it("switches to Monte Carlo in auto mode above the threshold", () => {
    const request = {
      holes: [
        ["Ah", "As"],
        ["Kd", "Kh"],
      ],
      board: ["2c", "7d", "9h"],
    };

    // 990 possible boards remain
    const exact = calculateOdds({
      ...request,
      options: { mode: "auto", threshold: 1000 },
    });
    const sampled = calculateOdds({
      ...request,
      options: { mode: "auto", threshold: 100 },
    });

    expect(exact.players[0].winChanceError).toBeUndefined();
    expect(sampled.players[0].winChanceError).toBeDefined();
  });

  it("calculates exhaustively when requested", () => {
    const result = calculateOdds({
      holes: [
        ["Ah", "As"],
        ["Kd", "Kh"],
      ],
      board: ["2c", "7d", "9h", "Jc"],
      options: { mode: "exhaustive" },
    });

    // 44 possible rivers
    expect(Number.isInteger(result.players[0].winChance * 44)).toBe(true);
    expect(result.players[0].winChanceError).toBeUndefined();
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
