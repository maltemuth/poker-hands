import cards from "../../../../src/model/card/cards";
import monteCarloOdds from "../../../../src/model/odds/monteCarloOdds";
import exhaustive from "../../../../src/model/odds/exhaustive";

describe("monteCarloOdds", () => {
  test("equal value hands have approximately equal win chance", () => {
    const results = monteCarloOdds(
      [cards("Ah", "As"), cards("Ad", "Ac")],
      [],
      10000
    );

    // With a large enough sample size, the win chances should be very close
    expect(Math.abs(results[0].winChance - results[1].winChance)).toBeLessThan(
      0.05
    );

    // Ties should be the majority of outcomes
    expect(results[0].tieChance).toBeGreaterThan(0.9);
  });

  test("every remaining card can complete the board", () => {
    // only the two remaining aces, Ac and As, win for the aces
    const holes = [cards("Ah", "Ad"), cards("Kh", "Ks")];
    const board = cards("Kd", "7c", "2h", "3d");

    const exact = exhaustive(holes, board)[0].winChance; // 2 of 44 cards
    const results = monteCarloOdds(holes, board, 20_000);

    expect(exact).toBeCloseTo(2 / 44, 5);
    // the margin of error is about 0.3 percentage points
    expect(Math.abs(results[0].winChance - exact)).toBeLessThan(0.012);
  });

  test("agrees with the exact result pre-flop", () => {
    // exhaustive: 42.66% for AK against QQ
    const results = monteCarloOdds(
      [cards("Ah", "Kd"), cards("Qc", "Qs")],
      [],
      30_000
    );

    // the margin of error is about 0.6 percentage points
    expect(Math.abs(results[0].winChance - 0.4266)).toBeLessThan(0.015);
  });

  test("pocket rockets versus tens", () => {
    const results = monteCarloOdds(
      [cards("Ah", "As"), cards("Td", "Tc")],
      [],
      10000
    );

    // Pocket rockets should win approximately 80% of the time
    expect(results[0].winChance).toBeCloseTo(0.8, 1);
    expect(results[1].winChance).toBeCloseTo(0.2, 1);
  });

  test("with partial board", () => {
    const results = monteCarloOdds(
      [cards("Ac", "Ad"), cards("Td", "Tc")],
      cards("7s", "8h", "Th"),
      10000
    );

    // The tens have made a set, so they should be favored
    expect(results[1].winChance).toBeGreaterThan(results[0].winChance);
  });

  test("with sample size parameter", () => {
    const results = monteCarloOdds(
      [cards("Ah", "As"), cards("Td", "Tc")],
      [],
      5000
    );

    // Should still produce reasonable results with smaller sample
    expect(results[0].winChance).toBeGreaterThan(0.5);
    expect(results[1].winChance).toBeLessThan(0.5);
  });

  test("includes confidence intervals", () => {
    const results = monteCarloOdds(
      [cards("Ah", "As"), cards("Td", "Tc")],
      [],
      10000
    );

    // Should include error estimates
    expect(results[0]).toHaveProperty("winChanceError");
    expect(results[0]).toHaveProperty("tieChanceError");
    expect(results[1]).toHaveProperty("winChanceError");
    expect(results[1]).toHaveProperty("tieChanceError");
  });

  test("throws error with no holes", () => {
    expect(() => monteCarloOdds([])).toThrow(
      "Cannot calculate odds without any holes."
    );
  });
});
