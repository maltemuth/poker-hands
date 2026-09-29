import hasFullHouse from "../../../../../src/model/hand/detect/hasFullHouse.js";
import cards from "../../../../../src/model/card/cards.js";

describe("detect full houses", () => {
  test("three-of-a-kind is not a full house", () => {
    expect(hasFullHouse(cards("Ad", "As", "Ah"))).toBe(false);
  });
});
