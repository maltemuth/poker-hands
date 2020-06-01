import getTwoPair from "../../../../../src/model/hand/get/getTwoPair";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";
import toString from "../../../../../src/model/card/toString";

describe("retrieve two pairs", () => {
  test("no two pairs with less than 4 cards", () => {
    expect(getTwoPair(cards("Ad", "As", "Ah"))).toBe(null);
  });

  test("retrieve two pair in the correct order", () => {
    const twoPair = getTwoPair(cards("Td", "Th", "Qh", "Qd"));

    expect(twoPair.type).toEqual(HandType.TwoPair);
    expect(twoPair.value()).toEqual(Value.queen);
    expect(twoPair.subvalue()).toEqual(Value.ten);
  });

  test("retrieve two pair in the correct order from seven cards", () => {
    const twoPair = getTwoPair(cards("3h", "Td", "Ah", "Th", "Qh", "Qd", "3d"));

    expect(twoPair.type).toEqual(HandType.TwoPair);
    expect(twoPair.value()).toEqual(Value.queen);
    expect(twoPair.subvalue()).toEqual(Value.ten);

    expect(twoPair.kickers().length).toBe(1);
    expect(twoPair.kickers().map(toString)).toEqual(["Ah"]);
  });
});
