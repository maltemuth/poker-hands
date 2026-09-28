import { Card } from "../card/Card";
import combinationCount from "../combinatorics/combinationCount";
import { SUIT_INDEX, addCard, removeCard } from "../hand/handState";
import createBoardTally, { Tally } from "./boardTally";
import { Hole, ProgressCallback } from "./HoleOdds";

export type { Tally } from "./boardTally";

/**
 * Counts which holes win or tie on every way to complete the board with the
 * remaining cards. The result is the same as calling winningHoles for each
 * board of combinations(rest, 5 - board.length), but no boards are built:
 * the board cards are added to a single hand state one by one, so a card
 * shared by many boards is added only once, and each hole only adds its own
 * two cards to the finished board.
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

  // suit indices and values, looked up once instead of for every board
  const restSuits = rest.map((card) => SUIT_INDEX[card.suit]);
  const restValues = rest.map((card) => card.value);

  // adds the missing board cards in every combination, from rest[start] on
  const completeBoard = (start: number, missingCards: number) => {
    if (missingCards === 0) {
      tallyBoard();
      return;
    }
    for (let i = start; i <= rest.length - missingCards; i++) {
      addCard(state, restSuits[i], restValues[i]);
      completeBoard(i + 1, missingCards - 1);
      removeCard(state, restSuits[i], restValues[i]);
    }
  };

  completeBoard(0, missing);

  return result();
};

export default tallyBoards;
