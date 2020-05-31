import getStraightFlush from "../../../../../src/model/hand/get/getStraightFlush";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";

describe("retrieve straight flushes", () => {
  test("four cards are no straight flush", () => {
    expect(getStraightFlush(cards("H2", "H3", "H4", "H5"))).toBe(null);
  });

  test("retrieve a straight flush", () => {
    const straightFlush = getStraightFlush(cards("H2", "H3", "H4", "H5", "H6"));
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
  });

  test("retrieve a straight flush from ace to 5", () => {
    const straightFlush = getStraightFlush(cards("HA", "H2", "H3", "H4", "H5"));
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
  });

  test("retrieves the highest straight flush", () => {
    const straightFlush = getStraightFlush(
      cards("HA", "H2", "H3", "H4", "H5", "H6", "H7")
    );
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
    expect(straightFlush.value()).toEqual(Value.seven);
  });

  test("ignores non-contiguous numbers straight", () => {
    const straight = getStraightFlush(
      cards("HA", "H2", "H3", "HT", "H5", "H6", "H7")
    );
    expect(straight).toBe(null);
  });

  test("ignores non-suited straights", () => {
    const straight = getStraightFlush(
      cards("HA", "H2", "H3", "D4", "H5", "H6", "H7")
    );
    expect(straight).toBe(null);
  });
});
