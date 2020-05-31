import getFourOfAKind from "../../../../../src/model/hand/get/getFourOfAKind";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";
import toString from "../../../../../src/model/card/toString";

describe("retrieve four-of-a-kind", () => {
  test("three-of-a-kind is not four-of-a-kind", () => {
    expect(getFourOfAKind(cards("DA", "SA", "HA"))).toBe(null);
  });

  test("retrieve four-of-a-kind", () => {
    const fourOfAKind = getFourOfAKind(
      cards("DT", "HT", "CT", "HQ", "DQ", "ST")
    );

    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(fourOfAKind.value()).toEqual(Value.ten);
  });

  test("retrieve four-of-a-kind in the correct order from seven cards", () => {
    const fourOfAKind = getFourOfAKind(
      cards("SQ", "DT", "HA", "HT", "HQ", "DQ", "CQ")
    );

    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(fourOfAKind.value()).toEqual(Value.queen);

    expect(fourOfAKind.kickers().length).toBe(1);
    expect(fourOfAKind.kickers().map(toString)).toEqual(["HA"]);
  });
});
