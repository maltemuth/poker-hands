import getTwoPair from "../../../../../src/model/hand/get/getTwoPair.js";
import cards from "../../../../../src/model/card/cards.js";
import { HandType } from "../../../../../src/model/hand/Hand.js";
import { Value } from "../../../../../src/model/card/Card.js";
import toString from "../../../../../src/model/card/toString.js";

describe("retrieve two pairs", () => {
  test("retrieve two pair in the correct order", () => {
    const twoPair = getTwoPair(cards("Td", "Th", "Qh", "Qd"));

    expect(twoPair!.type).toEqual(HandType.TwoPair);
    expect(twoPair!.value()).toEqual(Value.queen);
    expect(twoPair!.subvalue()).toEqual(Value.ten);
  });

  test("retrieve two pair in the correct order from seven cards", () => {
    const twoPair = getTwoPair(cards("3h", "Td", "Ah", "Th", "Qh", "Qd", "3d"));

    expect(twoPair!.type).toEqual(HandType.TwoPair);
    expect(twoPair!.value()).toEqual(Value.queen);
    expect(twoPair!.subvalue()).toEqual(Value.ten);

    expect(twoPair!.kickers().length).toBe(1);
    expect(twoPair!.kickers().map(toString)).toEqual(["Ah"]);
  });
});
