import hasFourOfAKind from "../../../../src/model/hand/detect/hasFourOfAKind";
import cards from "../../../../src/model/card/cards";

describe("detect four-of-akind", () => {
  test("three-of-a-kind is not four-of-akind", () => {
    expect(hasFourOfAKind(cards("SA", "HA", "DA"))).toBe(false);
  });

  test("detects four-of-akind", () => {
    expect(hasFourOfAKind(cards("SA", "HA", "DA", "CA"))).toBe(true);
  });
});
