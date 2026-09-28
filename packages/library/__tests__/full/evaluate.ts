import evaluate from "../../src/model/hand/evaluate";
import handRank from "../../src/model/hand/handRank";
import getBestHand from "../../src/model/hand/getBestHand";
import create from "../../src/model/deck/create";
import toString from "../../src/model/card/toString";
import { Card } from "../../src/model/card/Card";
import { HandType } from "../../src/model/hand/Hand";

/**
 * mulberry32: a small seeded generator, so every run tests the same hands
 */
const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const random = seededRandom(7);
const deck = create();

const randomHand = (size: number): Card[] => {
  const cards = [...deck];
  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(random() * (cards.length - i));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards.slice(0, size);
};

describe("evaluate", () => {
  test.each([
    [5, 50_000],
    [6, 50_000],
    [7, 200_000],
  ])(
    "agrees with handRank(getBestHand()) on random %i-card hands",
    (size, count) => {
      const mismatches: string[] = [];
      const types = new Set<HandType>();

      for (let i = 0; i < count; i++) {
        const cards = randomHand(size);
        const hand = getBestHand(cards);
        if (!hand) throw new Error("no hand");
        types.add(hand.type);

        const expected = handRank(hand);
        const actual = evaluate(cards);
        if (actual !== expected) {
          mismatches.push(
            `${cards.map(toString).join(" ")}: expected ${expected.toString(
              16
            )}, got ${actual.toString(16)}`
          );
        }
      }

      expect(mismatches.slice(0, 10)).toEqual([]);
      // every hand type except the rare royal flush comes up
      expect(types.size).toBeGreaterThanOrEqual(9);
    }
  );
});
