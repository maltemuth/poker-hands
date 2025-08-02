import hybridOdds, {
  calculateBoardCombinations,
} from "../../../../src/model/odds/hybridOdds";
import cards from "../../../../src/model/card/cards";

describe("hybridOdds", () => {
  it("should use exhaustive algorithm when combinations are below threshold", () => {
    // Simple case with few combinations - As, Ks vs 2d, 3d with board 4d, 5d, 6d
    const holes = [cards("As", "Ks"), cards("2d", "3d")];
    const board = cards("4d", "5d", "6d");

    // This should use the exhaustive algorithm since there are only C(47, 2) = 1081 combinations
    const result = hybridOdds(holes, board);

    expect(result).toHaveLength(2);
    expect(result[0].hole).toEqual(holes[0]);
    expect(result[1].hole).toEqual(holes[1]);

    // Both win chances and tie chances should sum to 1.0 (approximately)
    const totalWinChance = result[0].winChance + result[1].winChance;
    const totalTieChance = result[0].tieChance + result[1].tieChance;
    const total = totalWinChance + totalTieChance;

    expect(total).toBeCloseTo(1.0, 2); // Allow for small floating point errors
  });

  it("should use Monte Carlo algorithm when combinations exceed threshold", () => {
    // Case with pre-flop hands (no board) - this will have C(48, 5) = 1,712,304 combinations
    const holes = [cards("As", "Ah"), cards("Ks", "Kh")];

    // This should use the Monte Carlo algorithm since combinations exceed threshold
    const result = hybridOdds(holes, [], 5000); // Use smaller sample size for faster test

    expect(result).toHaveLength(2);
    expect(result[0].hole).toEqual(holes[0]);
    expect(result[1].hole).toEqual(holes[1]);

    // Should have error estimates for Monte Carlo
    expect(result[0].winChanceError).toBeDefined();
    expect(result[0].tieChanceError).toBeDefined();
    expect(result[1].winChanceError).toBeDefined();
    expect(result[1].tieChanceError).toBeDefined();

    // Both win chances and tie chances should sum to 1.0 (approximately)
    const totalWinChance = result[0].winChance + result[1].winChance;
    const totalTieChance = result[0].tieChance + result[1].tieChance;
    expect(totalWinChance + totalTieChance).toBeCloseTo(1.0, 1); // Less precision for Monte Carlo
  });
});

describe("calculateBoardCombinations", () => {
  it("should calculate correct number of combinations for pre-flop", () => {
    const holes = [cards("As", "Ah")];
    const combinations = calculateBoardCombinations(holes, []);
    // C(50, 5) = 2,118,760
    expect(combinations).toBe(2118760);
  });

  it("should calculate correct number of combinations for flop", () => {
    const holes = [cards("As", "Ah")];
    const board = cards("2d", "3d", "4d");
    const combinations = calculateBoardCombinations(holes, board);
    // C(47, 2) = 1081
    expect(combinations).toBe(1081);
  });

  it("should calculate correct number of combinations for turn", () => {
    const holes = [cards("As", "Ah")];
    const board = cards("2d", "3d", "4d", "5d");
    const combinations = calculateBoardCombinations(holes, board);
    // C(46, 1) = 46
    expect(combinations).toBe(46);
  });

  it("should calculate correct number of combinations for river", () => {
    const holes = [cards("As", "Ah")];
    const board = cards("2d", "3d", "4d", "5d", "6d");
    const combinations = calculateBoardCombinations(holes, board);
    // C(45, 0) = 1
    expect(combinations).toBe(1);
  });
});
