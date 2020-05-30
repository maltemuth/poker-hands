import cards from "../../../../src/model/card/cards";
import hasPair from "../../../../src/model/hand/detect/hasPair";

describe("detect pairs", () => {
  test("single card is no pair", () => {
    expect(hasPair(cards("SA"))).toBe(false);
  });

  test("single pair from two cards", () => {
    expect(hasPair(cards("SA", "HA"))).toBe(true);
  });

  test("single pair from seven cards", () => {
    expect(hasPair(cards("SA", "HA", "H7", "H9", "D3", "D4", "C2"))).toBe(true);
  });

  test("two pair is also a pair", () => {
    expect(hasPair(cards("SA", "HA", "H7", "D7", "D3", "D4", "C2"))).toBe(true);
  });
});
