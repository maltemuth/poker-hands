import getBestHand from "../../../../src/model/hand/getBestHand";
import cards from "../../../../src/model/card/cards";
import { HandType } from "../../../../src/model/hand/Hand";
import hasEqualValue from "../../../../src/model/hand/hasEqualValue";

describe("compare equal-value hands", () => {
  test("a straight flush is equal to another straight flush of different suit", () => {
    const straightFlush = getBestHand(
      cards("Js", "Ts", "9s", "Qs", "Qd", "5s", "8s")
    );
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
    const otherStraightFlush = getBestHand(
      cards("Jh", "Th", "9h", "Qh", "Qd", "5h", "8h")
    );
    expect(otherStraightFlush.type).toEqual(HandType.StraightFlush);
    expect(hasEqualValue(otherStraightFlush, straightFlush)).toBe(true);
  });
  test("four-of-a-kind is equal with same-value kickers", () => {
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qh", "Jd", "5s", "Jh")
    );
    expect(otherFourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(hasEqualValue(otherFourOfAKind, fourOfAKind)).toBe(true);
  });

  test("full house is euqal with same values and different suits", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jh", "Jd", "Qh", "Qd", "5s", "2s")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    expect(otherFullHouse.type).toEqual(HandType.FullHouse);
    expect(hasEqualValue(otherFullHouse, fullHouse)).toBe(true);
  });

  test("a flush is equal with a different suit", () => {
    const flush = getBestHand(cards("Ks", "Ts", "5s", "3s", "2s"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("Kh", "Th", "5h", "3h", "2h"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(hasEqualValue(otherFlush, flush)).toBe(true);
  });

  test("a straight is equal with same first card of diffent suits", () => {
    const straight = getBestHand(cards("7d", "5c", "6s", "4s", "3s"));
    expect(straight.type).toEqual(HandType.Straight);
    const otherStraight = getBestHand(cards("7c", "5s", "6s", "4d", "3s"));
    expect(otherStraight.type).toEqual(HandType.Straight);
    expect(hasEqualValue(otherStraight, straight)).toBe(true);
  });

  test("three-of-a-kind is equal with kickers of the same value and different suit", () => {
    const threeOfAKind = getBestHand(cards("3h", "3d", "3c", "7h", "9d"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("3h", "3d", "3c", "7c", "9s"));
    expect(otherThreeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(hasEqualValue(otherThreeOfAKind, threeOfAKind)).toBe(true);
  });

  test("two pair is equal with same values and same-value kicker", () => {
    const twoPair = getBestHand(cards("7h", "7d", "4c", "4d", "2d"));
    expect(twoPair.type).toEqual(HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("7h", "7d", "4c", "4d", "2s"));
    expect(otherTwoPair.type).toEqual(HandType.TwoPair);
    expect(hasEqualValue(otherTwoPair, twoPair)).toBe(true);
  });

  test("high card is equal with same value and same-value kickers", () => {
    const highCard = getBestHand(cards("Ts", "8c", "6h", "4d", "3c"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("Td", "8c", "6h", "4d", "3c"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(hasEqualValue(otherHighCard, highCard)).toBe(true);
  });

  test("pair is equal with same cards and same-value kickers", () => {
    const pair = getBestHand(cards("Th", "Td", "8c", "9d", "2d"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("Tc", "Td", "8c", "9d", "2d"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(hasEqualValue(otherPair, pair)).toBe(true);
  });
});
