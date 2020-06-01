import getStraight from "../../../../../src/model/hand/get/getStraight";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";

describe("retrieve straights", () => {
  test("retrieve a straight", () => {
    const straight = getStraight(cards("2h", "3h", "4h", "5h", "6h"));
    expect(straight.type).toEqual(HandType.Straight);
  });

  test("retrieve a straight from ace to 5", () => {
    const straight = getStraight(cards("Ah", "2h", "3h", "4h", "5h"));
    expect(straight.type).toEqual(HandType.Straight);
  });

  test("retrieves the highest straight", () => {
    const straight = getStraight(
      cards("Ah", "2h", "3h", "4h", "5h", "6h", "7h")
    );
    expect(straight.type).toEqual(HandType.Straight);
    expect(straight.value()).toEqual(Value.seven);
  });

  test("SJ HT S9 H8 S7 DT CT", () => {
    const straight = getStraight(cards(..."Js Th 9s 8h 7s Td Tc".split(" ")));
    expect(straight.type).toBe(HandType.Straight);
    expect(straight.value()).toEqual(Value.jack);
  });
});
