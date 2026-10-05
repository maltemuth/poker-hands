import cards from "../../../../src/model/card/cards.js";
import percentages from "../../../../src/model/odds/percentages.js";
import combinations from "../../../helpers/combinations.js";
import getBestHand from "../../../../src/model/hand/getBestHand.js";
import create from "../../../../src/model/deck/create.js";
import without from "../../../../src/model/card/without.js";
import { HandType } from "../../../../src/model/hand/Hand.js";
import { Card } from "../../../../src/model/card/Card.js";

// the straightforward way: build every board and count its best hand's type
const reference = (hole: Card[], board: Card[], dead: Card[]) => {
  const counts: Record<string, number> = {};
  const rest = without(create(), ...hole, ...board, ...dead);
  for (const restBoard of combinations(rest, 5 - board.length)) {
    const hand = getBestHand([...hole, ...board, ...restBoard]);
    if (!hand) throw new Error("no hand");
    const name = HandType[hand.type];
    const key = name[0].toLowerCase() + name.slice(1);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

describe("percentages", () => {
  test("counts every possible board once", () => {
    // 46 possible rivers
    const result = percentages(
      cards("Ah", "Kh"),
      cards("Qh", "Jh", "2c", "3d")
    );

    const total = Object.values(result).reduce(
      (sum, { count }) => sum + count,
      0
    );
    expect(total).toBe(46);
    expect(result.royalFlush.count).toBe(1);
  });

  test.each([
    ["river", ["Ah", "Kh"], ["Qh", "Jh", "2c", "3d"], []],
    ["turn", ["7s", "7d"], ["7c", "2h", "Kd"], []],
    ["flop, suited connectors", ["9h", "8h"], ["Th", "Jc", "2h"], []],
    ["flop, dead cards", ["Ah", "Kh"], ["Qh", "7c", "2d"], ["Th", "Jh", "9c"]],
  ])(
    "%s: counts the same hand types as building every board",
    (_, hole, board, dead) => {
      const result = percentages(
        cards(...hole),
        cards(...board),
        cards(...dead)
      );
      const expected = reference(
        cards(...hole),
        cards(...board),
        cards(...dead)
      );

      for (const [type, { count }] of Object.entries(result)) {
        expect([type, count]).toEqual([type, expected[type] ?? 0]);
      }
    }
  );

  test("rejects a card that is both in the hole and on the board", () => {
    expect(() =>
      percentages(cards("Ah", "Kh"), cards("Ah", "Jh", "2c"))
    ).toThrow("Duplicates found");
  });

  test("rejects a card that appears twice on the board", () => {
    expect(() =>
      percentages(cards("Ah", "Kh"), cards("Qh", "Qh", "2c"))
    ).toThrow("Duplicates found");
  });

  describe("with dead cards", () => {
    test("leaves dead cards out of the possible boards", () => {
      // 46 rivers, minus the two dead cards
      const result = percentages(
        cards("Ah", "Kh"),
        cards("Qh", "Jh", "2c", "3d"),
        cards("Th", "9c")
      );

      const total = Object.values(result).reduce(
        (sum, { count }) => sum + count,
        0
      );
      expect(total).toBe(44);
      // the only royal flush card is dead
      expect(result.royalFlush.count).toBe(0);
    });

    test("uses percentages of the remaining boards", () => {
      const result = percentages(
        cards("Ah", "Kh"),
        cards("Qh", "Jh", "2c", "3d"),
        cards("Th", "9c")
      );

      expect(result.flush.percentage).toBeCloseTo(8 / 44);
    });

    test("rejects a dead card that is also in the hole", () => {
      expect(() =>
        percentages(cards("Ah", "Kh"), [], cards("Ah", "2c"))
      ).toThrow("Duplicates found");
    });
  });

  test("rejects a hole without two cards", () => {
    expect(() => percentages(cards("Ah"))).toThrow(
      "Hole 1 must have 2 cards, but has 1"
    );
  });

  test("rejects a board of more than five cards", () => {
    expect(() =>
      percentages(cards("Ah", "Kh"), cards("2c", "3c", "4c", "5c", "6c", "7c"))
    ).toThrow("The board has 6 cards, at most 5 are allowed");
  });
});
