import getStraightFlush from "../../../../../src/model/hand/get/getStraightFlush";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";

describe("retrieve straight flushes", () => {
  test("four cards are no straight flush", () => {
    expect(getStraightFlush(cards("2h", "3h", "4h", "5h"))).toBe(null);
  });

  test("retrieve a straight flush", () => {
    const straightFlush = getStraightFlush(cards("2h", "3h", "4h", "5h", "6h"));
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
  });

  test("retrieve a straight flush from ace to 5", () => {
    const straightFlush = getStraightFlush(cards("Ah", "2h", "3h", "4h", "5h"));
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
  });

  test("retrieves the highest straight flush", () => {
    const straightFlush = getStraightFlush(
      cards("Ah", "2h", "3h", "4h", "5h", "6h", "7h")
    );
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
    expect(straightFlush.value()).toEqual(Value.seven);
  });

  test("ignores non-contiguous numbers straight", () => {
    const straight = getStraightFlush(
      cards("Ah", "2h", "3h", "Th", "5h", "6h", "7h")
    );
    expect(straight).toBe(null);
  });

  test("ignores non-suited straights", () => {
    const straight = getStraightFlush(
      cards("Ah", "2h", "3h", "4d", "5h", "6h", "7h")
    );
    expect(straight).toBe(null);
  });
});
