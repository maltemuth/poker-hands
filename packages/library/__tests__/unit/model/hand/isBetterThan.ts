import assert from "node:assert/strict";
import { describe, it } from "node:test";
import isBetterThan from "../../../../src/model/hand/isBetterThan.js";
import getBestHand from "../../../../src/model/hand/getBestHand.js";
import cards from "../../../../src/model/card/cards.js";
import { HandType } from "../../../../src/model/hand/Hand.js";
import hasEqualValue from "../../../../src/model/hand/hasEqualValue.js";
import { randomCards, seededRandom } from "../../../helpers/randomCards.js";

describe("compare hands", () => {
  it("a pair is better than a high card", () => {
    assert.equal(isBetterThan(getBestHand(cards("As", "Ac"))!, getBestHand(cards("As"))!), true);
  });

  it("two pair is better than a pair", () => {
    assert.equal(isBetterThan(
        getBestHand(cards("Js", "Jc", "Th", "Tc"))!,
        getBestHand(cards("As", "Ac"))!
      ), true);
  });
  it("three-of-a-kind is better than two pair", () => {
    assert.equal(isBetterThan(
        getBestHand(cards("Js", "5c", "Th", "Qc", "5d", "5h"))!,
        getBestHand(cards("Js", "Jc", "Th", "Tc"))!
      ), true);
  });
  it("a straight is better than three-of-a-kind", () => {
    const threeOfAKind = getBestHand(cards("Js", "5c", "Th", "Qc", "5d", "5h"));
    assert.deepEqual(threeOfAKind!.type, HandType.ThreeOfAKind);
    const straight = getBestHand(cards("3h", "2c", "6c", "4d", "5s"));
    assert.deepEqual(straight!.type, HandType.Straight);
    assert.equal(isBetterThan(straight!, threeOfAKind!), true);
  });
  it("a flush is better than three-of-a-kind", () => {
    assert.equal(isBetterThan(
        getBestHand(cards("Js", "2s", "7s", "As", "3s"))!,
        getBestHand(cards("Js", "5c", "Th", "Qc", "5d", "5h"))!
      ), true);
  });
  it("a flush is better than a straight", () => {
    const straight = getBestHand(cards("3h", "2c", "6c", "4d", "5s"));
    assert.deepEqual(straight!.type, HandType.Straight);
    const flush = getBestHand(cards("Js", "5c", "Ts", "Qs", "5d", "5s", "2s"));
    assert.equal(isBetterThan(flush!, straight!), true);
  });
  it("a full house is better than a flush", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    assert.deepEqual(fullHouse!.type, HandType.FullHouse);
    const flush = getBestHand(cards("Js", "5c", "Ts", "Qs", "5d", "5s", "2s"));
    assert.deepEqual(flush!.type, HandType.Flush);
    assert.equal(isBetterThan(fullHouse!, flush!), true);
  });
  it("four-of-a-kind is better than a full house", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    assert.deepEqual(fullHouse!.type, HandType.FullHouse);
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    assert.deepEqual(fourOfAKind!.type, HandType.FourOfAKind);
    assert.equal(isBetterThan(fourOfAKind!, fullHouse!), true);
  });
  it("a straight flush is better than four-of-a-kind", () => {
    const straightFlush = getBestHand(
      cards("Js", "Ts", "9s", "Qs", "Qd", "5s", "8s")
    );
    assert.deepEqual(straightFlush!.type, HandType.StraightFlush);
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    assert.deepEqual(fourOfAKind!.type, HandType.FourOfAKind);
    assert.equal(isBetterThan(straightFlush!, fourOfAKind!), true);
  });

  it("a straight flush is better with higher starting card", () => {
    const straightFlush = getBestHand(
      cards("Js", "Ts", "9s", "Qs", "Qd", "5s", "8s")
    );
    assert.deepEqual(straightFlush!.type, HandType.StraightFlush);
    const otherStraightFlush = getBestHand(
      cards("Js", "Ts", "9s", "Qs", "Qd", "Ks", "8s")
    );
    assert.deepEqual(otherStraightFlush!.type, HandType.StraightFlush);
    assert.equal(isBetterThan(otherStraightFlush!, straightFlush!), true);
  });

  it("four-of-a-kind is better with higher cards", () => {
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    assert.deepEqual(fourOfAKind!.type, HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("Ks", "Kc", "Ts", "Qs", "Kd", "5s", "Kh")
    );
    assert.deepEqual(otherFourOfAKind!.type, HandType.FourOfAKind);
    assert.equal(isBetterThan(otherFourOfAKind!, fourOfAKind!), true);
  });

  it("four-of-a-kind is better with higher kicker", () => {
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    assert.deepEqual(fourOfAKind!.type, HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Ks", "Jd", "5s", "Jh")
    );
    assert.deepEqual(otherFourOfAKind!.type, HandType.FourOfAKind);
    assert.equal(isBetterThan(otherFourOfAKind!, fourOfAKind!), true);
  });

  it("full house is better with higher card values", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    assert.deepEqual(fullHouse!.type, HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("Ks", "Kc", "Kd", "Qs", "Qd", "5s", "2s")
    );
    assert.deepEqual(otherFullHouse!.type, HandType.FullHouse);
    assert.equal(isBetterThan(otherFullHouse!, fullHouse!), true);
  });
  it("full house is better with higher sub values", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    assert.deepEqual(fullHouse!.type, HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Ks", "Kd", "5s", "2s")
    );
    assert.deepEqual(otherFullHouse!.type, HandType.FullHouse);
    assert.equal(isBetterThan(otherFullHouse!, fullHouse!), true);
  });

  it("a flush is better with higher first card", () => {
    const flush = getBestHand(cards("Ks", "Ts", "5s", "3s", "2s"));
    assert.deepEqual(flush!.type, HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Th", "5h", "3h", "2h"));
    assert.deepEqual(otherFlush!.type, HandType.Flush);
    assert.equal(isBetterThan(otherFlush!, flush!), true);
  });

  it("a flush is better with higher second card", () => {
    const flush = getBestHand(cards("As", "Ts", "5s", "3s", "2s"));
    assert.deepEqual(flush!.type, HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Qh", "5h", "3h", "2h"));
    assert.deepEqual(otherFlush!.type, HandType.Flush);
    assert.equal(isBetterThan(otherFlush!, flush!), true);
  });

  it("a flush is better with higher third card", () => {
    const flush = getBestHand(cards("As", "Ts", "5s", "3s", "2s"));
    assert.deepEqual(flush!.type, HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Th", "6h", "3h", "2h"));
    assert.deepEqual(otherFlush!.type, HandType.Flush);
    assert.equal(isBetterThan(otherFlush!, flush!), true);
  });

  it("a flush is better with higher fourth card", () => {
    const flush = getBestHand(cards("As", "Ts", "6s", "3s", "2s"));
    assert.deepEqual(flush!.type, HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Th", "6h", "4h", "2h"));
    assert.deepEqual(otherFlush!.type, HandType.Flush);
    assert.equal(isBetterThan(otherFlush!, flush!), true);
  });

  it("a flush is better with higher fifth card", () => {
    const flush = getBestHand(cards("As", "Ts", "6s", "4s", "2s"));
    assert.deepEqual(flush!.type, HandType.Flush);
    const otherFlush = getBestHand(cards("Ah", "Th", "6h", "4h", "3h"));
    assert.deepEqual(otherFlush!.type, HandType.Flush);
    assert.equal(isBetterThan(otherFlush!, flush!), true);
  });

  it("a straight is better with higher first card", () => {
    const straight = getBestHand(cards("7d", "5c", "6s", "4s", "3s"));
    assert.deepEqual(straight!.type, HandType.Straight);
    const otherStraight = getBestHand(cards("7c", "5s", "6s", "4d", "8s"));
    assert.deepEqual(otherStraight!.type, HandType.Straight);
    assert.equal(isBetterThan(otherStraight!, straight!), true);
  });

  it("three-of-a-kind is better with higher cards", () => {
    const threeOfAKind = getBestHand(cards("3h", "3d", "3c"));
    assert.deepEqual(threeOfAKind!.type, HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("4h", "4d", "4c"));
    assert.deepEqual(otherThreeOfAKind!.type, HandType.ThreeOfAKind);
    assert.equal(isBetterThan(otherThreeOfAKind!, threeOfAKind!), true);
  });
  it("three-of-a-kind is better with higher kicker", () => {
    const threeOfAKind = getBestHand(cards("3h", "3d", "3c", "4c"));
    assert.deepEqual(threeOfAKind!.type, HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("3h", "3d", "3c", "5c"));
    assert.deepEqual(otherThreeOfAKind!.type, HandType.ThreeOfAKind);
    assert.equal(isBetterThan(otherThreeOfAKind!, threeOfAKind!), true);
  });
  it("three-of-a-kind is better with higher second kicker", () => {
    const threeOfAKind = getBestHand(cards("3h", "3d", "3c", "4c", "2d"));
    assert.deepEqual(threeOfAKind!.type, HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("3h", "3d", "3c", "5c", "7h"));
    assert.deepEqual(otherThreeOfAKind!.type, HandType.ThreeOfAKind);
    assert.equal(isBetterThan(otherThreeOfAKind!, threeOfAKind!), true);
  });

  it("two pair is better with higher cards", () => {
    const twoPair = getBestHand(cards("7h", "7d", "9c", "9d", "2d"));
    assert.deepEqual(twoPair!.type, HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("Th", "Td", "4c", "4d", "2d"));
    assert.deepEqual(otherTwoPair!.type, HandType.TwoPair);
    assert.equal(isBetterThan(otherTwoPair!, twoPair!), true);
  });

  it("two pair is better with higher sub cards", () => {
    const twoPair = getBestHand(cards("Th", "Td", "8c", "8d", "2d"));
    assert.deepEqual(twoPair!.type, HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("Th", "Td", "9c", "9d", "2d"));
    assert.deepEqual(otherTwoPair!.type, HandType.TwoPair);
    assert.equal(isBetterThan(otherTwoPair!, twoPair!), true);
  });

  it("two pair is better with higher kicker", () => {
    const twoPair = getBestHand(cards("Th", "Td", "8c", "8d", "2d"));
    assert.deepEqual(twoPair!.type, HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("Th", "Td", "8c", "8d", "3d"));
    assert.deepEqual(otherTwoPair!.type, HandType.TwoPair);
    assert.equal(isBetterThan(otherTwoPair!, twoPair!), true);
  });

  it("pair is better with higher cards", () => {
    const pair = getBestHand(cards("Th", "Td", "8c", "9d", "2d"));
    assert.deepEqual(pair!.type, HandType.Pair);
    const otherPair = getBestHand(cards("Jh", "Jd", "8c", "9d", "3d"));
    assert.deepEqual(otherPair!.type, HandType.Pair);
    assert.equal(isBetterThan(otherPair!, pair!), true);
  });
  it("pair is better with higher kicker", () => {
    const pair = getBestHand(cards("Th", "Td", "7c", "8d", "2d"));
    assert.deepEqual(pair!.type, HandType.Pair);
    const otherPair = getBestHand(cards("Th", "Td", "7c", "9d", "3d"));
    assert.deepEqual(otherPair!.type, HandType.Pair);
    assert.equal(isBetterThan(otherPair!, pair!), true);
  });
  it("pair is better with higher second kicker", () => {
    const pair = getBestHand(cards("Th", "Td", "7c", "9d", "2d"));
    assert.deepEqual(pair!.type, HandType.Pair);
    const otherPair = getBestHand(cards("Th", "Td", "8c", "9d", "3d"));
    assert.deepEqual(otherPair!.type, HandType.Pair);
    assert.equal(isBetterThan(otherPair!, pair!), true);
  });
  it("pair is better with higher third kicker", () => {
    const pair = getBestHand(cards("Th", "Td", "7c", "9d", "2d"));
    assert.deepEqual(pair!.type, HandType.Pair);
    const otherPair = getBestHand(cards("Th", "Td", "7c", "9d", "3d"));
    assert.deepEqual(otherPair!.type, HandType.Pair);
    assert.equal(isBetterThan(otherPair!, pair!), true);
  });

  it("high card is better with higher card", () => {
    const highCard = getBestHand(cards("Ts", "8c", "6h", "4d", "3c"));
    assert.deepEqual(highCard!.type, HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "8c", "6h", "4d", "3c"));
    assert.deepEqual(otherHighCard!.type, HandType.HighCard);
    assert.equal(isBetterThan(otherHighCard!, highCard!), true);
  });
  it("high card is better with higher kicker", () => {
    const highCard = getBestHand(cards("Js", "8c", "6h", "4d", "3c"));
    assert.deepEqual(highCard!.type, HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "9c", "6h", "4d", "3c"));
    assert.deepEqual(otherHighCard!.type, HandType.HighCard);
    assert.equal(isBetterThan(otherHighCard!, highCard!), true);
  });
  it("high card is better with higher second kicker", () => {
    const highCard = getBestHand(cards("Js", "9c", "6h", "4d", "3c"));
    assert.deepEqual(highCard!.type, HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "9c", "7h", "4d", "3c"));
    assert.deepEqual(otherHighCard!.type, HandType.HighCard);
    assert.equal(isBetterThan(otherHighCard!, highCard!), true);
  });
  it("high card is better with higher third kicker", () => {
    const highCard = getBestHand(cards("Js", "9c", "7h", "4d", "3c"));
    assert.deepEqual(highCard!.type, HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "9c", "7h", "5d", "3c"));
    assert.deepEqual(otherHighCard!.type, HandType.HighCard);
    assert.equal(isBetterThan(otherHighCard!, highCard!), true);
  });

  it("high card is better with higher fourth kicker", () => {
    const highCard = getBestHand(cards("Js", "9c", "7h", "5d", "3c"));
    assert.deepEqual(highCard!.type, HandType.HighCard);
    const otherHighCard = getBestHand(cards("Js", "9c", "7h", "5d", "4c"));
    assert.deepEqual(otherHighCard!.type, HandType.HighCard);
    assert.equal(isBetterThan(otherHighCard!, highCard!), true);
  });

  it("high cards are equal when their best five cards are", () => {
    // both play A K Q J 9; the 7 and the 6 don't play
    const highCard = getBestHand(
      cards("As", "Kd", "Qc", "Jh", "9s", "7h", "2c")
    );
    const otherHighCard = getBestHand(
      cards("As", "Kd", "Qc", "Jh", "9s", "6d", "3s")
    );
    assert.deepEqual(highCard!.type, HandType.HighCard);
    assert.equal(isBetterThan(highCard!, otherHighCard!), false);
    assert.equal(isBetterThan(otherHighCard!, highCard!), false);
    assert.equal(hasEqualValue(highCard!, otherHighCard!), true);
  });
});

describe("compare hands consistently", () => {
  // regression: an earlier higher card must decide the comparison, even if a later card is lower
  const pairs: Array<[string, string[], string[]]> = [
    ["high card", ["As", "Kd", "4c", "3s", "2h"], ["Ah", "9d", "8c", "7s", "5h"]],
    ["flush", ["As", "Ks", "4s", "3s", "2s"], ["Ah", "9h", "8h", "7h", "5h"]],
    ["pair", ["Th", "Td", "Kc", "3d", "2d"], ["Ts", "Tc", "Qc", "9d", "8d"]],
    ["two pair", ["Th", "Td", "8c", "8d", "Kd"], ["Ts", "Tc", "8h", "8s", "Qd"]],
    ["three-of-a-kind", ["3h", "3d", "3c", "Kc", "2d"], ["3s", "3d", "3c", "Qc", "Jd"]],
  ];

  for (const [label, better, worse] of pairs) it(`${label}: higher leading card wins over higher trailing cards`, () => {
    const a = getBestHand(cards(...better))!;
    const b = getBestHand(cards(...worse))!;
    assert.deepEqual(a.type, b.type);
    assert.equal(isBetterThan(a, b), true);
    assert.equal(isBetterThan(b, a), false);
  });

  it("exactly one of a > b, b > a or a == b holds for random 7-card hands", () => {
    // seeded so failures are reproducible
    const random = seededRandom(42);
    const draw = () => randomCards(random, 7);

    for (let i = 0; i < 5000; i++) {
      const a = getBestHand(draw())!;
      const b = getBestHand(draw())!;
      const outcomes = [isBetterThan(a, b), isBetterThan(b, a), hasEqualValue(a, b)];
      assert.equal(outcomes.filter(Boolean).length, 1);
    }
  });
});
