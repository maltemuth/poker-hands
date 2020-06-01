import getRoyalFlush from "../../../../../src/model/hand/get/getRoyalFlush";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";

describe("retrieve royal flushes", () => {
  test("retrieve a royal flush", () => {
    const royalFlush = getRoyalFlush(cards("Th", "Jh", "Qh", "Kh", "Ah"));
    expect(royalFlush.type).toEqual(HandType.RoyalFlush);
    expect(royalFlush.value()).toEqual(Value.ace);
  });
});
