import tallyBoards from "../../../../src/model/odds/tallyBoards.js";
import winningHoles from "../../../helpers/winningHoles.js";
import combinations from "../../../helpers/combinations.js";
import create from "../../../../src/model/deck/create.js";
import without from "../../../../src/model/card/without.js";
import cards from "../../../../src/model/card/cards.js";
import { Card } from "../../../../src/model/card/Card.js";

const restOf = (holes: Card[][], board: Card[]) =>
  without(create(), ...holes.flat(), ...board);

// the straightforward way: build every board and determine its winners
const reference = (holes: Card[][], board: Card[]) => {
  const wins = holes.map(() => 0);
  const ties = holes.map(() => 0);
  const boards = combinations(restOf(holes, board), 5 - board.length);
  for (const restBoard of boards) {
    const winners = winningHoles(holes, [...board, ...restBoard]);
    if (winners.length === 1) wins[winners[0]]++;
    else winners.forEach((index) => ties[index]++);
  }
  return { wins, ties, boards: boards.length };
};

describe("tallyBoards", () => {
  test.each([
    [
      "complete board",
      [
        ["As", "Kd"],
        ["Ah", "9c"],
      ],
      ["8c", "7d", "5h", "3s", "2c"],
    ],
    [
      "split pot",
      [
        ["7h", "2c"],
        ["6d", "3s"],
      ],
      ["As", "Kd", "Qc", "Jh", "9s"],
    ],
    [
      "turn",
      [
        ["Ah", "As"],
        ["Td", "Tc"],
      ],
      ["7c", "7d", "6s", "2h"],
    ],
    [
      "flop",
      [
        ["Ah", "As"],
        ["Td", "Tc"],
      ],
      ["7c", "7d", "6s"],
    ],
    [
      "flop, three players",
      [
        ["Ah", "As"],
        ["Td", "Tc"],
        ["9s", "8s"],
      ],
      ["7c", "7d", "6s"],
    ],
    [
      "flop, many ties",
      [
        ["2h", "3d"],
        ["2c", "3s"],
      ],
      ["Ah", "Kd", "Qs"],
    ],
    [
      "two board cards",
      [
        ["Ah", "Kh"],
        ["Qd", "Qc"],
      ],
      ["Jh", "Th"],
    ],
  ])("%s: same result as building every board", (_, holeInput, boardInput) => {
    const holes = holeInput.map((hole) => cards(...hole));
    const board = cards(...boardInput);

    expect(tallyBoards(holes, board, restOf(holes, board))).toEqual(
      reference(holes, board)
    );
  });

  test("reports progress every 100 boards and at the end", () => {
    const holes = [cards("Ah", "As"), cards("Td", "Tc")];
    const board = cards("7c", "7d", "6s");
    const progress: number[] = [];

    tallyBoards(holes, board, restOf(holes, board), (share) =>
      progress.push(share)
    );

    // 990 boards: 9 reports at every 100th board, one at the end
    expect(progress).toHaveLength(10);
    expect(progress[0]).toBeCloseTo(100 / 990);
    expect(progress[progress.length - 1]).toBe(1);
  });
});
