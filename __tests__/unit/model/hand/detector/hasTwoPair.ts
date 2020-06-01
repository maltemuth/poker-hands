import cards from "../../../../../src/model/card/cards";
import hasTwoPair from "../../../../../src/model/hand/detect/hasTwoPair";

describe("detect pairs", () => {
  test("single card is no two pair", () => {
    expect(hasTwoPair(cards("As"))).toBe(false);
  });

  test("single pair is no two pair", () => {
    expect(hasTwoPair(cards("As", "Ah"))).toBe(false);
  });

  test("no two pairs with less than 4 cards", () => {
    expect(hasTwoPair(cards("Ad", "As", "Ah"))).toBe(false);
  });

  test("two pair from seven cards", () => {
    expect(hasTwoPair(cards("As", "Ah", "7h", "7d", "3d", "4d", "2c"))).toBe(
      true
    );
  });

  test("three-of-a-kind is not a two pair", () => {
    expect(hasTwoPair(cards("As", "Ah", "Ac", "7d", "3d", "4d", "2c"))).toBe(
      false
    );
  });
});
