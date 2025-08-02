import cards from "../../../../src/model/card/cards";
import monteCarloOdds from "../../../../src/model/odds/monteCarloOdds";

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
