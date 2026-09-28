import tallyRandomBoards from "../../../../src/model/odds/tallyRandomBoards";
import tallyBoards from "../../../../src/model/odds/tallyBoards";
import create from "../../../../src/model/deck/create";
import without from "../../../../src/model/card/without";
import toString from "../../../../src/model/card/toString";
import cards from "../../../../src/model/card/cards";
import { Card } from "../../../../src/model/card/Card";

const restOf = (holes: Card[][], board: Card[]) =>
  without(create(), ...holes.flat(), ...board);

// only the two remaining aces, Ac and As, win for the aces
const holes = [cards("Ah", "Ad"), cards("Kh", "Ks")];
const board = cards("Kd", "7c", "2h", "3d");
const rest = restOf(holes, board);

describe("tallyRandomBoards", () => {
  test("a complete board is counted once per sample", () => {
    const complete = cards("As", "Kd", "Qc", "Jh", "9s");
    const twoHoles = [cards("7h", "2c"), cards("6d", "3s")];

    expect(
      tallyRandomBoards(twoHoles, complete, restOf(twoHoles, complete), 50)
    ).toEqual({ wins: [0, 0], ties: [50, 50], boards: 50 });
  });

  test("can draw the last remaining card", () => {
    expect(toString(rest[rest.length - 1])).toBe("As");

    // in the first sample, a random number just below 1 draws the last card
    const result = tallyRandomBoards(
      holes,
      board,
      rest,
      1,
      undefined,
      () => 0.999999
    );

    expect(result.wins).toEqual([1, 0]);
  });

  test("draws every remaining card equally often", () => {
    const exact = tallyBoards(holes, board, rest);
    const random = tallyRandomBoards(holes, board, rest, 44_000);

    // exactly 2 of the 44 cards win for the aces: expected 2,000 wins,
    // with a standard deviation of about 44
    expect(exact.wins[0]).toBe(2);
    expect(random.wins[0]).toBeGreaterThan(1800);
    expect(random.wins[0]).toBeLessThan(2200);
    expect(random.boards).toBe(44_000);
  });

  test("reports progress every 100 boards and at the end", () => {
    const progress: number[] = [];
    tallyRandomBoards(holes, board, rest, 250, (share) => progress.push(share));

    expect(progress).toEqual([0.4, 0.8, 1]);
  });
});
