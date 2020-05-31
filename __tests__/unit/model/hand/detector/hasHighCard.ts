import hasHighCard from "../../../../../src/model/hand/detect/hasHighCard";
import cards from "../../../../../src/model/card/cards";

describe("detect high cards", () => {
  test("every card is a high card", () => {
    expect(hasHighCard(cards("SA"))).toBe(true);
  });
});
