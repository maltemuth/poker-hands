import isBetterThan from "../../../src/model/hand/isBetterThan";
import getBestHand from "../../../src/model/hand/getBestHand";
import cards from "../../../src/model/card/cards";
import { HandType } from "../../../src/model/hand/Hand";

describe("compare hands", () => {
  test("a pair is better than a high card", () => {
    expect(
      isBetterThan(getBestHand(cards("SA", "CA")), getBestHand(cards("SA")))
    ).toBe(true);
  });

  test("two pair is better than a pair", () => {
    expect(
      isBetterThan(
        getBestHand(cards("SJ", "CJ", "HT", "CT")),
        getBestHand(cards("SA", "CA"))
      )
    ).toBe(true);
  });
  test("three-of-a-kind is better than two pair", () => {
    expect(
      isBetterThan(
        getBestHand(cards("SJ", "C5", "HT", "CQ", "D5", "H5")),
        getBestHand(cards("SJ", "CJ", "HT", "CT"))
      )
    ).toBe(true);
  });
  test("a straight is better than three-of-a-kind", () => {
    const threeOfAKind = getBestHand(cards("SJ", "C5", "HT", "CQ", "D5", "H5"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const straight = getBestHand(cards("H3", "C2", "C6", "D4", "S5"));
    expect(straight.type).toEqual(HandType.Straight);
    expect(isBetterThan(straight, threeOfAKind)).toBe(true);
  });
  test("a flush is better than three-of-a-kind", () => {
    expect(
      isBetterThan(
        getBestHand(cards("SJ", "S2", "S7", "SA", "S3")),
        getBestHand(cards("SJ", "C5", "HT", "CQ", "D5", "H5"))
      )
    ).toBe(true);
  });
  test("a flush is better than a straight", () => {
    const straight = getBestHand(cards("H3", "C2", "C6", "D4", "S5"));
    expect(straight.type).toEqual(HandType.Straight);
    const flush = getBestHand(cards("SJ", "C5", "ST", "SQ", "D5", "S5", "S2"));
    expect(isBetterThan(flush, straight)).toBe(true);
  });
  test("a full house is better than a flush", () => {
    const fullHouse = getBestHand(
      cards("SJ", "CJ", "DJ", "SQ", "DQ", "S5", "S2")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const flush = getBestHand(cards("SJ", "C5", "ST", "SQ", "D5", "S5", "S2"));
    expect(flush.type).toEqual(HandType.Flush);
    expect(isBetterThan(fullHouse, flush)).toBe(true);
  });
  test("four-of-a-kind is better than a full house", () => {
    const fullHouse = getBestHand(
      cards("SJ", "CJ", "DJ", "SQ", "DQ", "S5", "S2")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const fourOfAKind = getBestHand(
      cards("SJ", "CJ", "ST", "SQ", "DJ", "S5", "HJ")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(isBetterThan(fourOfAKind, fullHouse)).toBe(true);
  });
  test("a straight flush is better than four-of-a-kind", () => {
    const straightFlush = getBestHand(
      cards("SJ", "ST", "S9", "SQ", "DQ", "S5", "S8")
    );
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
    const fourOfAKind = getBestHand(
      cards("SJ", "CJ", "ST", "SQ", "DJ", "S5", "HJ")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(isBetterThan(straightFlush, fourOfAKind)).toBe(true);
  });

  test("a straight flush is better with higher starting card", () => {
    const straightFlush = getBestHand(
      cards("SJ", "ST", "S9", "SQ", "DQ", "S5", "S8")
    );
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
    const otherStraightFlush = getBestHand(
      cards("SJ", "ST", "S9", "SQ", "DQ", "SK", "S8")
    );
    expect(otherStraightFlush.type).toEqual(HandType.StraightFlush);
    expect(isBetterThan(otherStraightFlush, straightFlush)).toBe(true);
  });

  test("four-of-a-kind is better with higher cards", () => {
    const fourOfAKind = getBestHand(
      cards("SJ", "CJ", "ST", "SQ", "DJ", "S5", "HJ")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("SK", "CK", "ST", "SQ", "DK", "S5", "HK")
    );
    expect(otherFourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(isBetterThan(otherFourOfAKind, fourOfAKind)).toBe(true);
  });

  test("four-of-a-kind is better with higher kicker", () => {
    const fourOfAKind = getBestHand(
      cards("SJ", "CJ", "ST", "SQ", "DJ", "S5", "HJ")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("SJ", "CJ", "ST", "SK", "DJ", "S5", "HJ")
    );
    expect(otherFourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(isBetterThan(otherFourOfAKind, fourOfAKind)).toBe(true);
  });

  test("full house is better with higher card values", () => {
    const fullHouse = getBestHand(
      cards("SJ", "CJ", "DJ", "SQ", "DQ", "S5", "S2")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("SK", "CK", "DK", "SQ", "DQ", "S5", "S2")
    );
    expect(otherFullHouse.type).toEqual(HandType.FullHouse);
    expect(isBetterThan(otherFullHouse, fullHouse)).toBe(true);
  });
  test("full house is better with higher sub values", () => {
    const fullHouse = getBestHand(
      cards("SJ", "CJ", "DJ", "SQ", "DQ", "S5", "S2")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("SJ", "CJ", "DJ", "SK", "DK", "S5", "S2")
    );
    expect(otherFullHouse.type).toEqual(HandType.FullHouse);
    expect(isBetterThan(otherFullHouse, fullHouse)).toBe(true);
  });

  test("a flush is better with higher first card", () => {
    const flush = getBestHand(cards("SK", "ST", "S5", "S3", "S2"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("HA", "HT", "H5", "H3", "H2"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a flush is better with higher second card", () => {
    const flush = getBestHand(cards("SA", "ST", "S5", "S3", "S2"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("HA", "HQ", "H5", "H3", "H2"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a flush is better with higher third card", () => {
    const flush = getBestHand(cards("SA", "ST", "S5", "S3", "S2"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("HA", "HT", "H6", "H3", "H2"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a flush is better with higher fourth card", () => {
    const flush = getBestHand(cards("SA", "ST", "S6", "S3", "S2"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("HA", "HT", "H6", "H4", "H2"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a flush is better with higher fifth card", () => {
    const flush = getBestHand(cards("SA", "ST", "S6", "S4", "S2"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("HA", "HT", "H6", "H4", "H3"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a straight is better with higher first card", () => {
    const straight = getBestHand(cards("D7", "C5", "S6", "S4", "S3"));
    expect(straight.type).toEqual(HandType.Straight);
    const otherStraight = getBestHand(cards("C7", "S5", "S6", "D4", "S8"));
    expect(otherStraight.type).toEqual(HandType.Straight);
    expect(isBetterThan(otherStraight, straight)).toBe(true);
  });

  test("three-of-a-kind is better with higher cards", () => {
    const threeOfAKind = getBestHand(cards("H3", "D3", "C3"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("H4", "D4", "C4"));
    expect(otherThreeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(isBetterThan(otherThreeOfAKind, threeOfAKind)).toBe(true);
  });
  test("three-of-a-kind is better with higher kicker", () => {
    const threeOfAKind = getBestHand(cards("H3", "D3", "C3", "C4"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("H3", "D3", "C3", "C5"));
    expect(otherThreeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(isBetterThan(otherThreeOfAKind, threeOfAKind)).toBe(true);
  });
  test("three-of-a-kind is better with higher second kicker", () => {
    const threeOfAKind = getBestHand(cards("H3", "D3", "C3", "C4", "D2"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("H3", "D3", "C3", "C5", "H7"));
    expect(otherThreeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(isBetterThan(otherThreeOfAKind, threeOfAKind)).toBe(true);
  });

  test("two pair is better with higher cards", () => {
    const twoPair = getBestHand(cards("H7", "D7", "C9", "D9", "D2"));
    expect(twoPair.type).toEqual(HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("HT", "DT", "C4", "D4", "D2"));
    expect(otherTwoPair.type).toEqual(HandType.TwoPair);
    expect(isBetterThan(otherTwoPair, twoPair)).toBe(true);
  });

  test("two pair is better with higher sub cards", () => {
    const twoPair = getBestHand(cards("HT", "DT", "C8", "D8", "D2"));
    expect(twoPair.type).toEqual(HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("HT", "DT", "C9", "D9", "D2"));
    expect(otherTwoPair.type).toEqual(HandType.TwoPair);
    expect(isBetterThan(otherTwoPair, twoPair)).toBe(true);
  });

  test("two pair is better with higher kicker", () => {
    const twoPair = getBestHand(cards("HT", "DT", "C8", "D8", "D2"));
    expect(twoPair.type).toEqual(HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("HT", "DT", "C8", "D8", "D3"));
    expect(otherTwoPair.type).toEqual(HandType.TwoPair);
    expect(isBetterThan(otherTwoPair, twoPair)).toBe(true);
  });

  test("pair is better with higher cards", () => {
    const pair = getBestHand(cards("HT", "DT", "C8", "D9", "D2"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("HJ", "DJ", "C8", "D9", "D3"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(isBetterThan(otherPair, pair)).toBe(true);
  });
  test("pair is better with higher kicker", () => {
    const pair = getBestHand(cards("HT", "DT", "C7", "D8", "D2"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("HT", "DT", "C7", "D9", "D3"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(isBetterThan(otherPair, pair)).toBe(true);
  });
  test("pair is better with higher second kicker", () => {
    const pair = getBestHand(cards("HT", "DT", "C7", "D9", "D2"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("HT", "DT", "C8", "D9", "D3"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(isBetterThan(otherPair, pair)).toBe(true);
  });
  test("pair is better with higher third kicker", () => {
    const pair = getBestHand(cards("HT", "DT", "C7", "D9", "D2"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("HT", "DT", "C7", "D9", "D3"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(isBetterThan(otherPair, pair)).toBe(true);
  });

  test("high card is better with higher card", () => {
    const highCard = getBestHand(cards("ST", "C8", "H6", "D4", "C3"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("SJ", "C8", "H6", "D4", "C3"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });
  test("high card is better with higher kicker", () => {
    const highCard = getBestHand(cards("SJ", "C8", "H6", "D4", "C3"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("SJ", "C9", "H6", "D4", "C3"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });
  test("high card is better with higher second kicker", () => {
    const highCard = getBestHand(cards("SJ", "C9", "H6", "D4", "C3"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("SJ", "C9", "H7", "D4", "C3"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });
  test("high card is better with higher third kicker", () => {
    const highCard = getBestHand(cards("SJ", "C9", "H7", "D4", "C3"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("SJ", "C9", "H7", "D5", "C3"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });

  test("high card is better with higher fourth kicker", () => {
    const highCard = getBestHand(cards("SJ", "C9", "H7", "D5", "C3"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("SJ", "C9", "H7", "D5", "C4"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });
});
