import getFullHouse from "../../../../../src/model/hand/get/getFullHouse";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";

describe("retrieve full house", () => {
  test("three-of-a-kind is not a full house", () => {
    expect(getFullHouse(cards("DA", "SA", "HA"))).toBe(null);
  });

  test("retrieve full house", () => {
    const fullHouse = getFullHouse(cards("DT", "HT", "CT", "HQ", "DQ", "ST"));

    expect(fullHouse.type).toEqual(HandType.FullHouse);
    expect(fullHouse.value()).toEqual(Value.ten);
    expect(fullHouse.subvalue()).toEqual(Value.queen);
  });

  test("retrieve full house in the correct order from seven cards", () => {
    const fullHouse = getFullHouse(
      cards("SQ", "DT", "HA", "HT", "HQ", "DQ", "CQ")
    );

    expect(fullHouse.type).toEqual(HandType.FullHouse);
    expect(fullHouse.value()).toEqual(Value.queen);
    expect(fullHouse.subvalue()).toEqual(Value.ten);

    expect(fullHouse.kickers().length).toBe(0);
  });
});
