import assert from "node:assert/strict";
import { describe, it } from "node:test";
import getBestHand from "../../../../src/model/hand/getBestHand.js";
import cards from "../../../../src/model/card/cards.js";
import { HandType } from "../../../../src/model/hand/Hand.js";
import hasEqualValue from "../../../../src/model/hand/hasEqualValue.js";

describe("compare equal-value hands", () => {
  it("a straight flush is equal to another straight flush of different suit", () => {
    const straightFlush = getBestHand(
      cards("Js", "Ts", "9s", "Qs", "Qd", "5s", "8s")
    );
    assert.deepEqual(straightFlush!.type, HandType.StraightFlush);
    const otherStraightFlush = getBestHand(
      cards("Jh", "Th", "9h", "Qh", "Qd", "5h", "8h")
    );
    assert.deepEqual(otherStraightFlush!.type, HandType.StraightFlush);
    assert.equal(hasEqualValue(otherStraightFlush!, straightFlush!), true);
  });
  it("four-of-a-kind is equal with same-value kickers", () => {
    const fourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qs", "Jd", "5s", "Jh")
    );
    assert.deepEqual(fourOfAKind!.type, HandType.FourOfAKind);
    const otherFourOfAKind = getBestHand(
      cards("Js", "Jc", "Ts", "Qh", "Jd", "5s", "Jh")
    );
    assert.deepEqual(otherFourOfAKind!.type, HandType.FourOfAKind);
    assert.equal(hasEqualValue(otherFourOfAKind!, fourOfAKind!), true);
  });

  it("full house is euqal with same values and different suits", () => {
    const fullHouse = getBestHand(
      cards("Js", "Jh", "Jd", "Qh", "Qd", "5s", "2s")
    );
    assert.deepEqual(fullHouse!.type, HandType.FullHouse);
    const otherFullHouse = getBestHand(
      cards("Js", "Jc", "Jd", "Qs", "Qd", "5s", "2s")
    );
    assert.deepEqual(otherFullHouse!.type, HandType.FullHouse);
    assert.equal(hasEqualValue(otherFullHouse!, fullHouse!), true);
  });

  it("a flush is equal with a different suit", () => {
    const flush = getBestHand(cards("Ks", "Ts", "5s", "3s", "2s"));
    assert.deepEqual(flush!.type, HandType.Flush);
    const otherFlush = getBestHand(cards("Kh", "Th", "5h", "3h", "2h"));
    assert.deepEqual(otherFlush!.type, HandType.Flush);
    assert.equal(hasEqualValue(otherFlush!, flush!), true);
  });

  it("a straight is equal with same first card of diffent suits", () => {
    const straight = getBestHand(cards("7d", "5c", "6s", "4s", "3s"));
    assert.deepEqual(straight!.type, HandType.Straight);
    const otherStraight = getBestHand(cards("7c", "5s", "6s", "4d", "3s"));
    assert.deepEqual(otherStraight!.type, HandType.Straight);
    assert.equal(hasEqualValue(otherStraight!, straight!), true);
  });

  it("three-of-a-kind is equal with kickers of the same value and different suit", () => {
    const threeOfAKind = getBestHand(cards("3h", "3d", "3c", "7h", "9d"));
    assert.deepEqual(threeOfAKind!.type, HandType.ThreeOfAKind);
    const otherThreeOfAKind = getBestHand(cards("3h", "3d", "3c", "7c", "9s"));
    assert.deepEqual(otherThreeOfAKind!.type, HandType.ThreeOfAKind);
    assert.equal(hasEqualValue(otherThreeOfAKind!, threeOfAKind!), true);
  });

  it("two pair is equal with same values and same-value kicker", () => {
    const twoPair = getBestHand(cards("7h", "7d", "4c", "4d", "2d"));
    assert.deepEqual(twoPair!.type, HandType.TwoPair);
    const otherTwoPair = getBestHand(cards("7h", "7d", "4c", "4d", "2s"));
    assert.deepEqual(otherTwoPair!.type, HandType.TwoPair);
    assert.equal(hasEqualValue(otherTwoPair!, twoPair!), true);
  });

  it("high card is equal with same value and same-value kickers", () => {
    const highCard = getBestHand(cards("Ts", "8c", "6h", "4d", "3c"));
    assert.deepEqual(highCard!.type, HandType.HighCard);
    const otherHighCard = getBestHand(cards("Td", "8c", "6h", "4d", "3c"));
    assert.deepEqual(otherHighCard!.type, HandType.HighCard);
    assert.equal(hasEqualValue(otherHighCard!, highCard!), true);
  });

  it("pair is equal with same cards and same-value kickers", () => {
    const pair = getBestHand(cards("Th", "Td", "8c", "9d", "2d"));
    assert.deepEqual(pair!.type, HandType.Pair);
    const otherPair = getBestHand(cards("Tc", "Td", "8c", "9d", "2d"));
    assert.deepEqual(otherPair!.type, HandType.Pair);
    assert.equal(hasEqualValue(otherPair!, pair!), true);
  });
});
