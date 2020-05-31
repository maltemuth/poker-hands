import getRoyalFlush from "../../../../../src/model/hand/get/getRoyalFlush";
import cards from "../../../../../src/model/card/cards";
import { HandType } from "../../../../../src/model/hand/Hand";
import { Value } from "../../../../../src/model/card/Card";

describe("retrieve royal flushes", () => {
  test("a straight flush is not a royal flush", () => {
    expect(getRoyalFlush(cards("H9", "HT", "HJ", "HQ", "HK"))).toBe(null);
  });

  test("retrieve a royal flush", () => {
    const royalFlush = getRoyalFlush(cards("HT", "HJ", "HQ", "HK", "HA"));
    expect(royalFlush.type).toEqual(HandType.RoyalFlush);
    expect(royalFlush.value()).toEqual(Value.ace);
  });
});
