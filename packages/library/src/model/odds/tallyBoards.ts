import { Card } from "../card/Card";
import combinationCount from "../combinatorics/combinationCount";
import {
  SUIT_INDEX,
  addCard,
  createHandState,
  rankOf,
  removeCard,
} from "../hand/handState";
import { Hole, ProgressCallback } from "./HoleOdds";

/**
 * How often each hole wins or ties, over a number of boards
 */
export interface Tally {
  wins: number[];
  ties: number[];
  boards: number;
}

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
  const state = createHandState();
  for (const card of board) addCard(state, SUIT_INDEX[card.suit], card.value);

  // suit indices and values, looked up once instead of for every board
  const restSuits = rest.map((card) => SUIT_INDEX[card.suit]);
  const restValues = rest.map((card) => card.value);
  const holeSuits = holes.map((hole) =>
    hole.map((card) => SUIT_INDEX[card.suit])
  );
  const holeValues = holes.map((hole) => hole.map((card) => card.value));

  const wins = holes.map(() => 0);
  const ties = holes.map(() => 0);
  const ranks = holes.map(() => 0);
  const missing = 5 - board.length;
  const total = combinationCount(rest.length, missing);
  let boards = 0;

  // the board in the state is complete: rank each hole on it
  const tallyBoard = () => {
    let best = 0;
    let winners = 0;
    for (let hole = 0; hole < holes.length; hole++) {
      const suits = holeSuits[hole];
      const values = holeValues[hole];
      for (let i = 0; i < suits.length; i++) {
        addCard(state, suits[i], values[i]);
      }
      const rank = rankOf(state);
      for (let i = 0; i < suits.length; i++) {
        removeCard(state, suits[i], values[i]);
      }

      ranks[hole] = rank;
      if (rank > best) {
        best = rank;
        winners = 1;
      } else if (rank === best) {
        winners++;
      }
    }

    // a single winner gets a win, otherwise each tied hole gets a tie
    if (winners === 1) {
      wins[ranks.indexOf(best)]++;
    } else {
      for (let hole = 0; hole < holes.length; hole++) {
        if (ranks[hole] === best) ties[hole]++;
      }
    }

    boards++;
    if (progressCallback && (boards % 100 === 0 || boards === total)) {
      progressCallback(boards / total);
    }
  };

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

  return { wins, ties, boards };
};

export default tallyBoards;
