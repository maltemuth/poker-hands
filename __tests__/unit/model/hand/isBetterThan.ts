import isBetterThan from "../../../../src/model/hand/isBetterThan";
import getBestHand from "../../../../src/model/hand/getBestHand";
import cards from "../../../../src/model/card/cards";
import { HandType } from "../../../../src/model/hand/Hand";

describe("compare hands", () => {
  test("a pair is better than a high card", () => {
    expect(
      isBetterThan(getBestHand(cards("As", "Ac")), getBestHand(cards("As")))
    ).toBe(true);
  });

  test("two pair is better than a pair", () => {
    expect(
      isBetterThan(
        getBestHand(cards("Js", "Jc", "Th", "Tc")),
        getBestHand(cards("As", "Ac"))
      )
    ).toBe(true);
  });
  test("three-of-a-kind is better than two pair", () => {
    expect(
      isBetterThan(
        getBestHand(cards("Js", "5c", "Th", "Qc", "5d", "5h")),
        getBestHand(cards("Js", "Jc", "Th", "Tc"))
      )
    ).toBe(true);
  });
  test("a straight is better than three-of-a-kind", () => {
    const threeOfAKind = getBestHand(cards("Js", "5c", "Th", "Qc", "5d", "5h"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const straight = getBestHand(cards("3h", "2c", "6c", "4d", "5s"));
    expect(straight.type).toEqual(HandType.Straight);
    expect(isBetterThan(straight, threeOfAKind)).toBe(true);
  });
  test("a flush is better than three-of-a-kind", () => {
    expect(
      isBetterThan(
        getBestHand(cards("Js", "2s", "7s", "As", "3s")),
        getBestHand(cards("Js", "5c", "Th", "Qc", "5d", "5h"))
      )
    ).toBe(true);
  });
  test("a flush is better than a straight", () => {
    const straight = getBestHand(cards("3h", "2c", "6c", "4d", "5s"));
    expect(straight.type).toEqual(HandType.Straight);
    const flush = getBestHand(cards("Js", "5c", "Ts", "Qs", "5d", "5s", "2s"));
    expect(isBetterThan(flush, straight)).toBe(true);
  });
  test("a full house is better than a flush", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const flush = getBestHand(cards("Js", "5c", "Ts", "Qs", "5d", "5s", "2s"));
    expect(flush.type).toEqual(HandType.Flush);
    expect(isBetterThan(fullHouse, flush)).toBe(true);
  });
  test("four-of-a-kind is better than a full house", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(isBetterThan(fourOfAKind, fullHouse)).toBe(true);
  });
  test("a straight flush is better than four-of-a-kind", () => {
    const straightFlush = getBestHand(
      cards("Js", "Ts", "9s", "Qs", "Qd", "5s", "8s")
    );
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(isBetterThan(straightFlush, fourOfAKind)).toBe(true);
  });

  test("a straight flush is better with higher starting card", () => {
    const straightFlush = getBestHand(
      cards("Js", "Ts", "9s", "Qs", "Qd", "5s", "8s")
    );
    expect(straightFlush.type).toEqual(HandType.StraightFlush);
    const otherStraightFlush = getBestHand(
      cards("Js", "Ts", "9s", "Qs", "Qd", "Ks", "8s")
    );
    expect(otherStraightFlush.type).toEqual(HandType.StraightFlush);
    expect(isBetterThan(otherStraightFlush, straightFlush)).toBe(true);
  });

  test("four-of-a-kind is better with higher cards", () => {
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("Ks", "Kc", "Ts", "Qs", "Kd", "5s", "Kh")
    );
    expect(otherFourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(isBetterThan(otherFourOfAKind, fourOfAKind)).toBe(true);
  });

  test("four-of-a-kind is better with higher kicker", () => {
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    expect(fourOfAKind.type).toEqual(HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Ks", "Jd", "5s", "Jh")
    );
    expect(otherFourOfAKind.type).toEqual(HandType.FourOfAKind);
    expect(isBetterThan(otherFourOfAKind, fourOfAKind)).toBe(true);
  });

  test("full house is better with higher card values", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("Ks", "Kc", "Kd", "Qs", "Qd", "5s", "2s")
    );
    expect(otherFullHouse.type).toEqual(HandType.FullHouse);
    expect(isBetterThan(otherFullHouse, fullHouse)).toBe(true);
  });
  test("full house is better with higher sub values", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    expect(fullHouse.type).toEqual(HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Ks", "Kd", "5s", "2s")
    );
    expect(otherFullHouse.type).toEqual(HandType.FullHouse);
    expect(isBetterThan(otherFullHouse, fullHouse)).toBe(true);
  });

  test("a flush is better with higher first card", () => {
    const flush = getBestHand(cards("Ks", "Ts", "5s", "3s", "2s"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Th", "5h", "3h", "2h"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a flush is better with higher second card", () => {
    const flush = getBestHand(cards("As", "Ts", "5s", "3s", "2s"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Qh", "5h", "3h", "2h"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a flush is better with higher third card", () => {
    const flush = getBestHand(cards("As", "Ts", "5s", "3s", "2s"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Th", "6h", "3h", "2h"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a flush is better with higher fourth card", () => {
    const flush = getBestHand(cards("As", "Ts", "6s", "3s", "2s"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Th", "6h", "4h", "2h"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a flush is better with higher fifth card", () => {
    const flush = getBestHand(cards("As", "Ts", "6s", "4s", "2s"));
    expect(flush.type).toEqual(HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Th", "6h", "4h", "3h"));
    expect(otherFlush.type).toEqual(HandType.Flush);
    expect(isBetterThan(otherFlush, flush)).toBe(true);
  });

  test("a straight is better with higher first card", () => {
    const straight = getBestHand(cards("7d", "5c", "6s", "4s", "3s"));
    expect(straight.type).toEqual(HandType.Straight);
    const otherStraight = getBestHand(cards("7c", "5s", "6s", "4d", "8s"));
    expect(otherStraight.type).toEqual(HandType.Straight);
    expect(isBetterThan(otherStraight, straight)).toBe(true);
  });

  test("three-of-a-kind is better with higher cards", () => {
    const threeOfAKind = getBestHand(cards("3h", "3d", "3c"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("4h", "4d", "4c"));
    expect(otherThreeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(isBetterThan(otherThreeOfAKind, threeOfAKind)).toBe(true);
  });
  test("three-of-a-kind is better with higher kicker", () => {
    const threeOfAKind = getBestHand(cards("3h", "3d", "3c", "4c"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("3h", "3d", "3c", "5c"));
    expect(otherThreeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(isBetterThan(otherThreeOfAKind, threeOfAKind)).toBe(true);
  });
  test("three-of-a-kind is better with higher second kicker", () => {
    const threeOfAKind = getBestHand(cards("3h", "3d", "3c", "4c", "2d"));
    expect(threeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("3h", "3d", "3c", "5c", "7h"));
    expect(otherThreeOfAKind.type).toEqual(HandType.ThreeOfAKind);
    expect(isBetterThan(otherThreeOfAKind, threeOfAKind)).toBe(true);
  });

  test("two pair is better with higher cards", () => {
    const twoPair = getBestHand(cards("7h", "7d", "9c", "9d", "2d"));
    expect(twoPair.type).toEqual(HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("Th", "Td", "4c", "4d", "2d"));
    expect(otherTwoPair.type).toEqual(HandType.TwoPair);
    expect(isBetterThan(otherTwoPair, twoPair)).toBe(true);
  });

  test("two pair is better with higher sub cards", () => {
    const twoPair = getBestHand(cards("Th", "Td", "8c", "8d", "2d"));
    expect(twoPair.type).toEqual(HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("Th", "Td", "9c", "9d", "2d"));
    expect(otherTwoPair.type).toEqual(HandType.TwoPair);
    expect(isBetterThan(otherTwoPair, twoPair)).toBe(true);
  });

  test("two pair is better with higher kicker", () => {
    const twoPair = getBestHand(cards("Th", "Td", "8c", "8d", "2d"));
    expect(twoPair.type).toEqual(HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("Th", "Td", "8c", "8d", "3d"));
    expect(otherTwoPair.type).toEqual(HandType.TwoPair);
    expect(isBetterThan(otherTwoPair, twoPair)).toBe(true);
  });

  test("pair is better with higher cards", () => {
    const pair = getBestHand(cards("Th", "Td", "8c", "9d", "2d"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("Jh", "Jd", "8c", "9d", "3d"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(isBetterThan(otherPair, pair)).toBe(true);
  });
  test("pair is better with higher kicker", () => {
    const pair = getBestHand(cards("Th", "Td", "7c", "8d", "2d"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("Th", "Td", "7c", "9d", "3d"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(isBetterThan(otherPair, pair)).toBe(true);
  });
  test("pair is better with higher second kicker", () => {
    const pair = getBestHand(cards("Th", "Td", "7c", "9d", "2d"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("Th", "Td", "8c", "9d", "3d"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(isBetterThan(otherPair, pair)).toBe(true);
  });
  test("pair is better with higher third kicker", () => {
    const pair = getBestHand(cards("Th", "Td", "7c", "9d", "2d"));
    expect(pair.type).toEqual(HandType.Pair);
    const otherPair = getBestHand(cards("Th", "Td", "7c", "9d", "3d"));
    expect(otherPair.type).toEqual(HandType.Pair);
    expect(isBetterThan(otherPair, pair)).toBe(true);
  });

  test("high card is better with higher card", () => {
    const highCard = getBestHand(cards("Ts", "8c", "6h", "4d", "3c"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "8c", "6h", "4d", "3c"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });
  test("high card is better with higher kicker", () => {
    const highCard = getBestHand(cards("Js", "8c", "6h", "4d", "3c"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "9c", "6h", "4d", "3c"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });
  test("high card is better with higher second kicker", () => {
    const highCard = getBestHand(cards("Js", "9c", "6h", "4d", "3c"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "9c", "7h", "4d", "3c"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });
  test("high card is better with higher third kicker", () => {
    const highCard = getBestHand(cards("Js", "9c", "7h", "4d", "3c"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "9c", "7h", "5d", "3c"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });

  test("high card is better with higher fourth kicker", () => {
    const highCard = getBestHand(cards("Js", "9c", "7h", "5d", "3c"));
    expect(highCard.type).toEqual(HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "9c", "7h", "5d", "4c"));
    expect(otherHighCard.type).toEqual(HandType.HighCard);
    expect(isBetterThan(otherHighCard, highCard)).toBe(true);
  });
});
