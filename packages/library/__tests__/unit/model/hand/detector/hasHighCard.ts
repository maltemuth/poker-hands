import hasHighCard from "../../../../../src/model/hand/detect/hasHighCard.js";
import cards from "../../../../../src/model/card/cards.js";

describe("detect high cards", () => {
  test("every card is a high card", () => {
    expect(hasHighCard(cards("As"))).toBe(true);
  });

  test("no high card without cards", () => {
    expect(hasHighCard([])).toBe(false);
  });
});
