import evaluate from "../../../../src/model/hand/evaluate";
import handRank from "../../../../src/model/hand/handRank";
import getBestHand from "../../../../src/model/hand/getBestHand";
import cards from "../../../../src/model/card/cards";

describe("evaluate", () => {
  test.each([
    // one hand of each type
    ["high card", ["As", "Kd", "Qc", "Jh", "9s", "7h", "2c"], 0x1edcb9],
    ["pair", ["Jh", "Jd", "4s", "9c", "2d", "Ac", "3h"], 0x2bbe94],
    ["two pair", ["Ah", "8d", "Kc", "As", "8c"], 0x3ee88d],
    ["three of a kind", ["7h", "7d", "7s", "Kc", "2d", "9s", "4h"], 0x4777d9],
    ["straight", ["9h", "Td", "Js", "Qc", "Kd"], 0x5dcba9],
    ["wheel", ["Ah", "2d", "3s", "4c", "5d"], 0x554321],
    ["flush", ["Ah", "3h", "9h", "Kh", "5h"], 0x6ed953],
    ["full house", ["Kh", "Kd", "Ks", "9c", "9d", "2s", "4h"], 0x7ddd99],
    ["four of a kind", ["7h", "7d", "7s", "7c", "2d"], 0x877772],
    ["straight flush", ["9h", "Th", "Jh", "Qh", "Kh"], 0x9dcba9],
    ["royal flush", ["Ah", "Kh", "Qh", "Jh", "Th", "9h", "2c"], 0xaedcba],
    // the pitfalls
    [
      "flush and straight in different cards",
      ["9h", "Th", "Jc", "Qh", "Kd", "2h", "4h"],
      0x6ca942,
    ],
    ["steel wheel", ["Ah", "2h", "3h", "4h", "5h", "Kd", "Qc"], 0x954321],
    [
      "six-high straight over wheel",
      ["Ah", "2d", "3s", "4c", "5d", "6h", "Kc"],
      0x565432,
    ],
    [
      "straight with a pair",
      ["5d", "6h", "7c", "8s", "9d", "9h", "2c"],
      0x598765,
    ],
    [
      "best five of six flush cards",
      ["Ah", "Kh", "9h", "5h", "3h", "2h", "Qd"],
      0x6ed953,
    ],
    [
      "two three of a kinds",
      ["Kh", "Kd", "Ks", "9c", "9d", "9s", "2h"],
      0x7ddd99,
    ],
    [
      "three of a kind and two pairs",
      ["Kh", "Kd", "Ks", "Qc", "Qd", "9s", "9h"],
      0x7dddcc,
    ],
    ["three pairs", ["Ah", "Ad", "8s", "8c", "5d", "5h", "3c"], 0x3ee885],
    [
      "four of a kind and three of a kind",
      ["7h", "7d", "7s", "7c", "Kd", "Kh", "Ks"],
      0x87777d,
    ],
  ])("%s", (_, input, expected) => {
    const hand = getBestHand(cards(...input));
    if (!hand) throw new Error("no hand");

    expect(evaluate(cards(...input))).toBe(expected);
    expect(evaluate(cards(...input))).toBe(handRank(hand));
  });

  test("the order of the cards doesn't matter", () => {
    expect(evaluate(cards("2c", "9d", "Ks", "9c", "Kh", "4h", "Kd"))).toBe(
      0x7ddd99
    );
  });

  test("calls don't affect each other", () => {
    const flush = cards("Ah", "3h", "9h", "Kh", "5h");
    const pair = cards("Jh", "Jd", "4s", "9c", "2d");
    expect(evaluate(flush)).toBe(0x6ed953);
    expect(evaluate(pair)).toBe(0x2bb942);
    expect(evaluate(flush)).toBe(0x6ed953);
  });
});
