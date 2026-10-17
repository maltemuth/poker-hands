import assert from "node:assert/strict";
import { describe, it } from "node:test";
import getBestHand from "../../../../src/model/hand/getBestHand.js";
import cards from "../../../../src/model/card/cards.js";
import toString from "../../../../src/model/card/toString.js";
import { HandType } from "../../../../src/model/hand/Hand.js";

const best = (...input: string[]) => {
  const hand = getBestHand(cards(...input));
  return {
    type: HandType[hand.type],
    cards: hand.cards().map(toString),
    kickers: hand.kickers().map(toString),
  };
};

describe("best hand", () => {
  for (const [input, type, made, kickers] of [
    // [input, type, cards, kickers]
    [["As"], "HighCard", ["As"], []],
    [["7s", "5s"], "HighCard", ["7s"], ["5s"]],
    [
      ["2c", "Js", "7h", "As", "9d", "3h", "Kc"],
      "HighCard",
      ["As"],
      ["Kc", "Js", "9d", "7h"],
    ],
    [["As", "Ad"], "Pair", ["As", "Ad"], []],
    [["Td", "Tc", "Jh", "Jd"], "TwoPair", ["Jh", "Jd", "Td", "Tc"], []],
    [
      ["3h", "Td", "Ah", "Th", "Qh", "Qd", "3d"],
      "TwoPair",
      ["Qh", "Qd", "Td", "Th"],
      ["Ah"],
    ],
    [
      ["3h", "Td", "Ah", "Th", "Qh", "Qd", "Qs"],
      "FullHouse",
      ["Qh", "Qd", "Qs", "Td", "Th"],
      [],
    ],
    [
      ["3h", "Td", "Ah", "2h", "Qh", "Qd", "Qs"],
      "ThreeOfAKind",
      ["Qh", "Qd", "Qs"],
      ["Ah", "Td"],
    ],
    [
      ["2h", "3d", "4h", "5c", "6h"],
      "Straight",
      ["6h", "5c", "4h", "3d", "2h"],
      [],
    ],
    [
      ["Ah", "2d", "3h", "4c", "5h"],
      "Straight",
      ["5h", "4c", "3h", "2d", "Ah"],
      [],
    ],
    [
      ["Js", "Th", "9s", "8h", "7s", "Td", "Tc"],
      "Straight",
      ["Js", "Th", "9s", "8h", "7s"],
      [],
    ],
    [
      ["7h", "Th", "Qh", "Jh", "3h", "2d", "Ah"],
      "Flush",
      ["Ah", "Qh", "Jh", "Th", "7h"],
      [],
    ],
    [
      ["Td", "Th", "Tc", "Qh", "Qd", "Ts"],
      "FourOfAKind",
      ["Td", "Th", "Tc", "Ts"],
      ["Qh"],
    ],
    [
      ["Qs", "Td", "Ah", "Th", "Qh", "Qd", "Qc"],
      "FourOfAKind",
      ["Qs", "Qh", "Qd", "Qc"],
      ["Ah"],
    ],
    [
      ["Ah", "2h", "3h", "4h", "5h", "6h", "7h"],
      "StraightFlush",
      ["7h", "6h", "5h", "4h", "3h"],
      [],
    ],
    [
      ["Ah", "2h", "3h", "4h", "5h", "6d", "7c"],
      "StraightFlush",
      ["5h", "4h", "3h", "2h", "Ah"],
      [],
    ],
    // the straight flush is in hearts, not the higher straight with the 9c
    [
      ["5h", "6h", "7h", "8h", "9h", "Tc", "6c"],
      "StraightFlush",
      ["9h", "8h", "7h", "6h", "5h"],
      [],
    ],
    [
      ["Th", "Jh", "Qh", "Kh", "Ah", "Ac", "Kc"],
      "RoyalFlush",
      ["Ah", "Kh", "Qh", "Jh", "Th"],
      [],
    ],
  ])
    it(`${JSON.stringify(input)} is ${type}`, () => {
      assert.deepEqual(best(...input), { type, cards: made, kickers });
    });

  for (const extra of ["Jd", "Qc", "Ks", "Ad", "Tc"])
    it(`a royal flush with an extra ${extra} stays a royal flush`, () => {
      assert.equal(
        best("Ah", "Kh", "Qh", "Jh", "Th", extra, "2c").type,
        "RoyalFlush"
      );
    });

  it("no cards are a high card without cards", () => {
    assert.deepEqual(best(), { type: "HighCard", cards: [], kickers: [] });
  });

  it("rejects more than seven cards", () => {
    assert.throws(
      () => getBestHand(cards("2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h")),
      { message: "At most 7 cards can be ranked" }
    );
  });

  it("rejects a card that appears twice", () => {
    assert.throws(() => getBestHand(cards("Ah", "Ah", "Kd")), {
      message: "Duplicates found in card list 'Ah,Ah,Kd'",
    });
  });

  for (const [label, input] of [
    ["high card", ["Kd", "2c", "Ah", "7s", "9h", "4d", "Jc"]],
    ["straight", ["9d", "Tc", "6h", "8s", "7h", "2d", "Kc"]],
    ["flush", ["Kh", "2h", "Ac", "7h", "9h", "4d", "3h"]],
  ])
    it(`leaves the order of its input unchanged: ${label}`, () => {
      const hand = cards(...input);
      getBestHand(hand);

      assert.deepEqual(hand.map(toString), input);
    });
});
