import assert from "node:assert/strict";
import { describe, it } from "node:test";
import handRank from "../../../../src/model/hand/handRank.js";
import getBestHand from "../../../../src/model/hand/getBestHand.js";
import cards from "../../../../src/model/card/cards.js";

const rank = (...input: string[]) => {
  const hand = getBestHand(cards(...input));
  if (!hand) throw new Error(`no hand for ${input.join(" ")}`);
  return handRank(hand);
};

describe("handRank", () => {
  for (const [label, input, expected] of [
    ["full house", ["Kh", "Kd", "Ks", "9c", "9d"], 0x7ddd99],
    ["full house, pair listed first", ["9c", "9d", "Kh", "Kd", "Ks"], 0x7ddd99],
    ["two pair", ["Ah", "8d", "Kc", "As", "8c"], 0x3ee88d],
    ["flush", ["Ah", "3h", "9h", "Kh", "5h"], 0x6ed953],
    ["four of a kind", ["7h", "7d", "7s", "7c", "2d"], 0x877772],
    ["pair", ["Jh", "Jd", "4s", "9c", "2d"], 0x2bb942],
    ["high card", ["Ah", "Jd", "4s", "9c", "2d"], 0x1eb942],
    ["straight", ["9h", "Td", "Js", "Qc", "Kd"], 0x5dcba9],
    ["wheel", ["Ah", "2d", "3s", "4c", "5d"], 0x554321],
    ["straight flush", ["9h", "Th", "Jh", "Qh", "Kh"], 0x9dcba9],
    ["royal flush", ["Ah", "Kh", "Qh", "Jh", "Th"], 0xaedcba],
  ] as [string, string[], number][])
    it(label, () => {
      assert.equal(rank(...input), expected);
    });

  it("uses the best five of seven cards", () => {
    // the full house K K K 9 9 beats the flush in hearts; the 2s doesn't play
    assert.equal(rank("Kh", "Kd", "Ks", "9h", "9d", "2s", "4h"), 0x7ddd99);
  });

  it("fills hands of fewer than five cards with zeros", () => {
    assert.equal(rank("As", "Ac"), 0x2ee000);
    assert.equal(rank("As"), 0x1e0000);
  });

  it("a better hand has a higher rank", () => {
    // trips decide a full house, the pair doesn't matter
    assert.ok(
      rank("Kh", "Kd", "Ks", "2c", "2d") > rank("Qh", "Qd", "Qs", "Ac", "Ad")
    );
    // the kicker decides between equal two pairs
    assert.ok(
      rank("Ah", "Ad", "8s", "8c", "Kd") > rank("As", "Ac", "8h", "8d", "Qd")
    );
    // the wheel is the lowest straight
    assert.ok(
      rank("2h", "3d", "4s", "5c", "6d") > rank("Ah", "2d", "3s", "4c", "5d")
    );
    // any pair beats any high card
    assert.ok(
      rank("2h", "2d", "3s", "4c", "5d") > rank("Ah", "Kd", "Qs", "Jc", "9d")
    );
  });

  it("equally strong hands have the same rank, whatever the suits", () => {
    assert.equal(
      rank("Ah", "Ad", "8s", "8c", "Kd"),
      rank("As", "Ac", "8h", "8d", "Kc")
    );
  });
});
