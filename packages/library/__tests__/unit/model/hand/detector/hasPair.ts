import cards from "../../../../../src/model/card/cards";
import hasPair from "../../../../../src/model/hand/detect/hasPair";

describe("detect pairs", () => {
  test("single card is no pair", () => {
    expect(hasPair(cards("As"))).toBe(false);
  });

  test("single pair from two cards", () => {
    expect(hasPair(cards("As", "Ah"))).toBe(true);
  });

  test("single pair from seven cards", () => {
    expect(hasPair(cards("As", "Ah", "7h", "9h", "3d", "4d", "2c"))).toBe(true);
  });

  test("two pair is also a pair", () => {
    expect(hasPair(cards("As", "Ah", "7h", "7d", "3d", "4d", "2c"))).toBe(true);
  });
});
