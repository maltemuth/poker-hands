import hasBetterValues from "../../../../src/model/card/hasBetterValues.js";
import cards from "../../../../src/model/card/cards.js";

describe("hasBetterValues", () => {
  test("higher first value wins", () => {
    expect(hasBetterValues(cards("As", "2d"), cards("Ks", "Qd"))).toBe(true);
  });

  test("compares later values only when earlier values are equal", () => {
    expect(hasBetterValues(cards("As", "Kd", "2c"), cards("Ah", "Qd", "Jc"))).toBe(true);
    expect(hasBetterValues(cards("Ah", "Qd", "Jc"), cards("As", "Kd", "2c"))).toBe(false);
  });

  test("order of input cards does not matter", () => {
    expect(hasBetterValues(cards("2c", "Kd", "As"), cards("Jc", "Ah", "Qd"))).toBe(true);
  });

  test("equal values are not better", () => {
    expect(hasBetterValues(cards("As", "Kd"), cards("Ah", "Kc"))).toBe(false);
  });

  test("empty sets are not better", () => {
    expect(hasBetterValues([], [])).toBe(false);
  });
});
