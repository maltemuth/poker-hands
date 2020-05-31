import getTwoPair from "../../../../src/model/hand/get/getTwoPair";
import cards from "../../../../src/model/card/cards";
import { HandType } from "../../../../src/model/hand/Hand";
import { Value } from "../../../../src/model/card/Card";
import toString from "../../../../src/model/card/toString";

describe("retrieve two pairs", () => {
  test("no two pairs with less than 4 cards", () => {
    expect(getTwoPair(cards("DA", "SA", "HA"))).toBe(null);
  });

  test("retrieve two pair in the correct order", () => {
    const twoPair = getTwoPair(cards("DT", "HT", "HQ", "DQ"));

    expect(twoPair.type).toEqual(HandType.TwoPair);
    expect(twoPair.value).toEqual(Value.queen);
    expect(twoPair.subvalue).toEqual(Value.ten);
  });

  test("retrieve two pair in the correct order from seven cards", () => {
    const twoPair = getTwoPair(cards("H3", "DT", "HA", "HT", "HQ", "DQ", "D3"));

    expect(twoPair.type).toEqual(HandType.TwoPair);
    expect(twoPair.value).toEqual(Value.queen);
    expect(twoPair.subvalue).toEqual(Value.ten);

    expect(twoPair.kickers.length).toBe(1);
    expect(twoPair.kickers.map(toString)).toEqual(["HA"]);
  });
});
