import getStraight from "../../../../../src/model/hand/get/getStraight";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";

describe("retrieve straights", () => {
  test("four cards are no straight", () => {
    expect(getStraight(cards("H2", "H3", "H4", "H5"))).toBe(null);
  });

  test("retrieve a straight", () => {
    const straight = getStraight(cards("H2", "H3", "H4", "H5", "H6"));
    expect(straight.type).toEqual(HandType.Straight);
  });

  test("retrieve a straight from ace to 5", () => {
    const straight = getStraight(cards("HA", "H2", "H3", "H4", "H5"));
    expect(straight.type).toEqual(HandType.Straight);
  });

  test("retrieves the highest straight", () => {
    const straight = getStraight(
      cards("HA", "H2", "H3", "H4", "H5", "H6", "H7")
    );
    expect(straight.type).toEqual(HandType.Straight);
    expect(straight.value()).toEqual(Value.seven);
  });

  test("ignores non-contiguous numbers straight", () => {
    const straight = getStraight(
      cards("HA", "H2", "H3", "HT", "H5", "H6", "H7")
    );
    expect(straight).toBe(null);
  });

  test("SJ HT S9 H8 S7 DT CT", () => {
    const straight = getStraight(cards(..."SJ HT S9 H8 S7 DT CT".split(" ")));
    expect(straight.type).toBe(HandType.Straight);
    expect(straight.value()).toEqual(Value.jack);
  });
});
