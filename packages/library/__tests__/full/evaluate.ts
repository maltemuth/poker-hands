import evaluate from "../../src/model/hand/evaluate.js";
import handRank from "../../src/model/hand/handRank.js";
import getBestHand from "../../src/model/hand/getBestHand.js";
import toString from "../../src/model/card/toString.js";
import { Card } from "../../src/model/card/Card.js";
import { HandType } from "../../src/model/hand/Hand.js";
import { randomCards, seededRandom } from "../helpers/randomCards.js";

const random = seededRandom(7);

const randomHand = (size: number): Card[] => randomCards(random, size);

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
