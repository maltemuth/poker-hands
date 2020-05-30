import cards from "../../../../src/model/card/cards";
import hasTwoPair from "../../../../src/model/hand/detect/hasTwoPair";

describe("detect pairs", () => {
  test("single card is no two pair", () => {
    expect(hasTwoPair(cards("SA"))).toBe(false);
  });

  test("single pair is no two pair", () => {
    expect(hasTwoPair(cards("SA", "HA"))).toBe(false);
  });

  test("two pair from seven cards", () => {
    expect(hasTwoPair(cards("SA", "HA", "H7", "D7", "D3", "D4", "C2"))).toBe(
      true
    );
  });

  test("three-of-a-kind is not a two pair", () => {
    expect(hasTwoPair(cards("SA", "HA", "CA", "D7", "D3", "D4", "C2"))).toBe(
      false
    );
  });
});
