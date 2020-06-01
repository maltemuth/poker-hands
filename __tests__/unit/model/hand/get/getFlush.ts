import getFlush from "../../../../../src/model/hand/get/getFlush";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";
import toString from "../../../../../src/model/card/toString";

describe("retrieve flushes", () => {
  test("retrieve flush", () => {
    const flush = getFlush(cards("7h", "Th", "Qh", "Jh", "3h"));

    expect(flush.type).toEqual(HandType.Flush);
    expect(flush.value()).toEqual(Value.queen);
    expect(flush.subvalue()).toBe(null);
    expect(flush.kickers().length).toBe(0);
  });

  test("retrieve correct flush out of seven cards", () => {
    const flush = getFlush(cards("7h", "Th", "Qh", "Jh", "3h", "2d", "Ah"));

    expect(flush.type).toEqual(HandType.Flush);
    expect(flush.value()).toEqual(Value.ace);
    expect(flush.subvalue()).toBe(null);

    expect(flush.kickers().length).toBe(0);
    expect(flush.cards().map(toString)).toEqual(["Ah", "Qh", "Jh", "Th", "7h"]);
  });
});
