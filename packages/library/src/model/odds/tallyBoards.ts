import { Card } from "../card/Card";
import combinationCount from "../combinatorics/combinationCount";
import createBoardTally, { Tally } from "./boardTally";
import forEachBoard from "./forEachBoard";
import { Hole, ProgressCallback } from "./HoleOdds";

export type { Tally } from "./boardTally";

/**
 * Counts which holes win or tie on every way to complete the board with the
 * remaining cards. The result is the same as calling winningHoles for each
 * board of combinations(rest, 5 - board.length), but no boards are built
 * (see forEachBoard), and each hole only adds its own two cards to the
 * finished board.
 *
 * @param holes - The players' hole cards
 * @param board - The known board cards (0 to 5)
 * @param rest - The cards the board can be completed with
 * @param progressCallback - Called with the share of boards done, every 100
 *   boards and after the last one
 * @returns The wins and ties of each hole, in the order of the holes, and the
 *   number of boards
 */
const tallyBoards = (
  holes: Hole[],
  board: Card[],
  rest: Card[],
  progressCallback?: ProgressCallback
): Tally => {
  const missing = 5 - board.length;
  const { state, tallyBoard, result } = createBoardTally(
    holes,
    board,
    combinationCount(rest.length, missing),
    progressCallback
  );

  forEachBoard(state, rest, missing, tallyBoard);

  return result();
};

export default tallyBoards;
