import getThreeOfAKind from "../../../../../src/model/hand/get/getThreeOfAKind";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";
import toString from "../../../../../src/model/card/toString";

describe("retrieve three-of-a-kind", () => {
  test("do not detect any three cards as three-of-a-kind", () => {
    expect(getThreeOfAKind(cards("DA", "SA", "HQ"))).toBe(null);
  });

  test("retrieve three-of-a-kind in the correct order", () => {
    const threeOfAKind = getThreeOfAKind(cards("DT", "HT", "CT", "HQ", "DQ"));

    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(threeOfAKind.value()).toEqual(Value.ten);
  });

  test("retrieve three-of-a-kind in the correct order from seven cards", () => {
    const threeOfAKind = getThreeOfAKind(
      cards("H3", "DT", "HA", "HT", "HQ", "DQ", "SQ")
    );

    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(threeOfAKind.value()).toEqual(Value.queen);

    expect(threeOfAKind.kickers().length).toBe(2);
    expect(threeOfAKind.kickers().map(toString)).toEqual(["HA", "HT"]);
  });
});
