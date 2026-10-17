import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { rankOf, suitMasksOf } from "../../../../src/model/hand/rankOf.js";
import cards from "../../../../src/model/card/cards.js";

describe("suitMasksOf", () => {
  it("sets each card's value bit in its suit's mask", () => {
    assert.deepEqual(suitMasksOf(cards("Ah", "2h", "Td", "Ks")), [
      (1 << 14) | (1 << 2),
      1 << 10,
      0,
      1 << 13,
    ]);
  });
});

describe("rankOf", () => {
  it("ranks the suit masks of some cards", () => {
    const masks = suitMasksOf(cards("Kh", "Kd", "Ks", "9c", "9d", "2s", "4h"));
    assert.equal(rankOf(...masks), 0x7ddd99);
  });

  it("ranks combined masks like the combined cards", () => {
    const [h, d, c, s] = suitMasksOf(cards("Ah", "Kh", "Qh", "Jh", "2c"));
    const [hh, hd, hc, hs] = suitMasksOf(cards("Th", "3d"));
    assert.equal(rankOf(h | hh, d | hd, c | hc, s | hs), 0xaedcba);
  });
});
