import { rankOf, suitMasksOf } from "../../../../src/model/hand/handState";
import cards from "../../../../src/model/card/cards";

describe("suitMasksOf", () => {
  test("sets each card's value bit in its suit's mask", () => {
    expect(suitMasksOf(cards("Ah", "2h", "Td", "Ks"))).toEqual([
      (1 << 14) | (1 << 2),
      1 << 10,
      0,
      1 << 13,
    ]);
  });
});

describe("rankOf", () => {
  test("ranks the suit masks of some cards", () => {
    const masks = suitMasksOf(cards("Kh", "Kd", "Ks", "9c", "9d", "2s", "4h"));
    expect(rankOf(...masks)).toBe(0x7ddd99);
  });

  test("ranks combined masks like the combined cards", () => {
    const [h, d, c, s] = suitMasksOf(cards("Ah", "Kh", "Qh", "Jh", "2c"));
    const [hh, hd, hc, hs] = suitMasksOf(cards("Th", "3d"));
    expect(rankOf(h | hh, d | hd, c | hc, s | hs)).toBe(0xaedcba);
  });
});
