import getBestHand from "../../../src/model/hand/getBestHand";
import cards from "../../../src/model/card/cards";
import { HandType } from "../../../src/model/hand/Hand";
import hasEqualValue from "../../../src/model/hand/hasEqualValue";

describe("compare equal-value hands", () => {
  test("a straight flush is equal to another straight flush of different suit", () => {
    const straightFlush = getBestHand(
      cards("SJ", "ST", "S9", "SQ", "DQ", "S5", "S8")
    );
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
    const otherStraightFlush = getBestHand(
      cards("HJ", "HT", "H9", "HQ", "DQ", "H5", "H8")
    );
    expect(otherStraightFlush.type).toEqual(HandType.StraightFlush);
    expect(hasEqualValue(otherStraightFlush, straightFlush)).toBe(true);
  });
  test("four-of-a-kind is equal with same-value kickers", () => {
    const fourOfAKind = getBestHand(
      cards("SJ", "CJ", "ST", "SQ", "DJ", "S5", "HJ")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("SJ", "CJ", "ST", "HQ", "DJ", "S5", "HJ")
    );
    expect(otherFourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(hasEqualValue(otherFourOfAKind, fourOfAKind)).toBe(true);
  });

  test("full house is euqal with same values and different suits", () => {
    const fullHouse = getBestHand(
      cards("SJ", "HJ", "DJ", "HQ", "DQ", "S5", "S2")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("SJ", "CJ", "DJ", "SQ", "DQ", "S5", "S2")
    );
    expect(otherFullHouse.type).toEqual(HandType.FullHouse);
    expect(hasEqualValue(otherFullHouse, fullHouse)).toBe(true);
  });

  test("a flush is equal with a different suit", () => {
    const flush = getBestHand(cards("SK", "ST", "S5", "S3", "S2"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("HK", "HT", "H5", "H3", "H2"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(hasEqualValue(otherFlush, flush)).toBe(true);
  });

  test("a straight is equal with same first card of diffent suits", () => {
    const straight = getBestHand(cards("D7", "C5", "S6", "S4", "S3"));
    expect(straight.type).toEqual(HandType.Straight);
    const otherStraight = getBestHand(cards("C7", "S5", "S6", "D4", "S3"));
    expect(otherStraight.type).toEqual(HandType.Straight);
    expect(hasEqualValue(otherStraight, straight)).toBe(true);
  });

  test("three-of-a-kind is equal with kickers of the same value and different suit", () => {
    const threeOfAKind = getBestHand(cards("H3", "D3", "C3", "H7", "D9"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("H3", "D3", "C3", "C7", "S9"));
    expect(otherThreeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(hasEqualValue(otherThreeOfAKind, threeOfAKind)).toBe(true);
  });

  test("two pair is equal with same values and same-value kicker", () => {
    const twoPair = getBestHand(cards("H7", "D7", "C4", "D4", "D2"));
    expect(twoPair.type).toEqual(HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("H7", "D7", "C4", "D4", "S2"));
    expect(otherTwoPair.type).toEqual(HandType.TwoPair);
    expect(hasEqualValue(otherTwoPair, twoPair)).toBe(true);
  });

  test("high card is equal with same value and same-value kickers", () => {
    const highCard = getBestHand(cards("ST", "C8", "H6", "D4", "C3"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("DT", "C8", "H6", "D4", "C3"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(hasEqualValue(otherHighCard, highCard)).toBe(true);
  });

  test("pair is equal with same cards and same-value kickers", () => {
    const pair = getBestHand(cards("HT", "DT", "C8", "D9", "D2"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("CT", "DT", "C8", "D9", "D2"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(hasEqualValue(otherPair, pair)).toBe(true);
  });
});
