import hasFourOfAKind from "../../../../../src/model/hand/detect/hasFourOfAKind.js";
import cards from "../../../../../src/model/card/cards.js";

describe("detect four-of-akind", () => {
  test("three-of-a-kind is not four-of-akind", () => {
    expect(hasFourOfAKind(cards("As", "Ah", "Ad"))).toBe(false);
    expect(hasFourOfAKind(cards("Ad", "As", "Ah"))).toBe(false);
  });

  test("detects four-of-akind", () => {
    expect(hasFourOfAKind(cards("As", "Ah", "Ad", "Ac"))).toBe(true);
  });
});
