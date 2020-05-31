import getHighCard from "../../../../src/model/hand/get/getHighCard";
import cards from "../../../../src/model/card/cards";
import { HandType } from "../../../../src/model/hand/Hand";
import toString from "../../../../src/model/card/toString";
import { Value } from "../../../../src/model/card/Card";

describe("retrieve high cards", () => {
  test("no high card without cards", () => {
    expect(getHighCard([])).toBe(null);
  });

  test("retrieve high card from one card", () => {
    const highCard = getHighCard(cards("SA"));
    expect(highCard.type).toEqual(HandType.HighCard);
    expect(highCard.cards.map(toString)).toEqual(["SA"]);
    expect(highCard.value).toEqual(Value.ace);
    expect(highCard.subvalue).toBe(null);
  });

  test("retrieve high card with one kicker", () => {
    const highCard = getHighCard(cards("S7", "S5"));
    expect(highCard.cards.map(toString)).toEqual(["S7"]);
    expect(highCard.kickers.map(toString)).toEqual(["S5"]);
    expect(highCard.value).toEqual(Value.seven);
  });
});
