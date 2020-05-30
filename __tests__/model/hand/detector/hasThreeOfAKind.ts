import hasThreeOfAKind from "../../../../src/model/hand/detect/hasThreeOfAKind";
import cards from "../../../../src/model/card/cards";

describe("detect three-of-a-kind", () => {
  test("pair is not three-of-a-kind", () => {
    expect(hasThreeOfAKind(cards("SA", "HA"))).toBe(false);
  });

  test("detects three-of-a-kind", () => {
    expect(hasThreeOfAKind(cards("SA", "HA", "DA"))).toBe(true);
  });
});
