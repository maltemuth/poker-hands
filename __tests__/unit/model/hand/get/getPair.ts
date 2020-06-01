import getPair from "../../../../../src/model/hand/get/getPair";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";
import toString from "../../../../../src/model/card/toString";

describe("retrieve pairs", () => {
  test("no pair with less than two cards", () => {
    expect(getPair(cards("As"))).toBe(null);
  });

  test("retrieve a pair", () => {
    const pair = getPair(cards("As", "Ad"));
    expect(pair.type).toEqual(HandType.Pair);
    expect(pair.value()).toEqual(Value.ace);
    expect(pair.subvalue()).toBe(null);
  });

  test("retrieve the higher pair", () => {
    const pair = getPair(cards("Td", "Tc", "Jh", "Jd"));
    expect(pair.type).toEqual(HandType.Pair);
    expect(pair.value()).toEqual(Value.jack);
  });

  test("retrieve highest pair from seven cards", () => {
    const pair = getPair(cards("3h", "Td", "Ah", "Th", "Qh", "Qd", "3d"));

    expect(pair.type).toEqual(HandType.Pair);
    expect(pair.value()).toEqual(Value.queen);
    expect(pair.kickers().length).toBe(3);
    expect(pair.kickers().map(toString)).toEqual(
      expect.arrayContaining(["Ah", "Td", "Th"])
    );

    expect(pair.kickers().map(({ value }) => value)).toEqual([
      Value.ace,
      Value.ten,
      Value.ten,
    ]);
  });
});
