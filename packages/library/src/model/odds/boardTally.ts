import { Card } from "../card/Card";
import {
  HandState,
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
 * Counts wins and ties over boards that are completed in a shared hand state
 */
export interface BoardTally {
  /** holds the board: the known cards, plus whatever the caller adds */
  state: HandState;
  /** ranks each hole on the complete board in the state and counts it */
  tallyBoard: () => void;
  result: () => Tally;
}

/**
 * Creates the counting part of an odds calculation: the caller completes the
 * board in `state` in whatever way it likes (all combinations, random draws)
 * and calls `tallyBoard` for each complete board. Each hole only adds its own
 * cards to the board, so no card arrays are built per board.
 *
 * @param holes - The players' hole cards
 * @param board - The known board cards, already added to the state
 * @param total - The number of boards the caller will tally, for progress
 * @param progressCallback - Called with the share of boards done, every 100
 *   boards and after the last one
 */
const createBoardTally = (
  holes: Hole[],
  board: Card[],
  total: number,
  progressCallback?: ProgressCallback
): BoardTally => {
  const state = createHandState();
  for (const card of board) addCard(state, SUIT_INDEX[card.suit], card.value);

  // suit indices and values, looked up once instead of for every board
  const holeSuits = holes.map((hole) =>
    hole.map((card) => SUIT_INDEX[card.suit])
  );
  const holeValues = holes.map((hole) => hole.map((card) => card.value));

  const wins = holes.map(() => 0);
  const ties = holes.map(() => 0);
  const ranks = holes.map(() => 0);
  let boards = 0;

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

  return { state, tallyBoard, result: () => ({ wins, ties, boards }) };
};

export default createBoardTally;
