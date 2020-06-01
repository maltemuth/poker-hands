import hasThreeOfAKind from "../../../../../src/model/hand/detect/hasThreeOfAKind";
import cards from "../../../../../src/model/card/cards";

describe("detect three-of-a-kind", () => {
  test("pair is not three-of-a-kind", () => {
    expect(hasThreeOfAKind(cards("As", "Ah"))).toBe(false);
  });

  test("do not detect any three cards as three-of-a-kind", () => {
    expect(hasThreeOfAKind(cards("Ad", "As", "Qh"))).toBe(false);
  });

  test("detects three-of-a-kind", () => {
    expect(hasThreeOfAKind(cards("As", "Ah", "Ad"))).toBe(true);
  });
});
