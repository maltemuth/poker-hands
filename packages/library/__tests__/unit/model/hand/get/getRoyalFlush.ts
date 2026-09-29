import getRoyalFlush from "../../../../../src/model/hand/get/getRoyalFlush.js";
import cards from "../../../../../src/model/card/cards.js";
import { HandType } from "../../../../../src/model/hand/Hand.js";
import { Value } from "../../../../../src/model/card/Card.js";

describe("retrieve royal flushes", () => {
  test("retrieve a royal flush", () => {
    const royalFlush = getRoyalFlush(cards("Th", "Jh", "Qh", "Kh", "Ah"));
    expect(royalFlush).not.toBeNull();
    expect(royalFlush!.type).toEqual(HandType.RoyalFlush);
    expect(royalFlush!.value()).toEqual(Value.ace);
  });
});
