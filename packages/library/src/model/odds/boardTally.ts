import { rankOf, suitMasksOf } from "../hand/rankOf";
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
 * Counts wins and ties over complete boards
 */
export interface BoardTally {
  /** ranks each hole on a complete board, given as its suit masks */
  tallyBoard: (h: number, d: number, c: number, s: number) => void;
  result: () => Tally;
}

/**
 * Creates the counting part of an odds calculation: the caller completes
 * boards in whatever way it likes (all combinations, random draws) and calls
 * `tallyBoard` with each complete board's suit masks. Each hole's masks are
 * computed once and combined with the board's, so no cards are copied or
 * added per board.
 *
 * @param holes - The players' hole cards
 * @param total - The number of boards the caller will tally, for progress
 * @param progressCallback - Called with the share of boards done, every 100
 *   boards and after the last one
 */
const createBoardTally = (
  holes: Hole[],
  total: number,
  progressCallback?: ProgressCallback
): BoardTally => {
  const holeMasks = holes.map(suitMasksOf);
  const holeH = holeMasks.map((masks) => masks[0]);
  const holeD = holeMasks.map((masks) => masks[1]);
  const holeC = holeMasks.map((masks) => masks[2]);
  const holeS = holeMasks.map((masks) => masks[3]);

  const wins = holes.map(() => 0);
  const ties = holes.map(() => 0);
  const ranks = holes.map(() => 0);
  let boards = 0;

  const tallyBoard = (h: number, d: number, c: number, s: number) => {
    let best = 0;
    let winners = 0;
    for (let hole = 0; hole < holes.length; hole++) {
      const rank = rankOf(
        h | holeH[hole],
        d | holeD[hole],
        c | holeC[hole],
        s | holeS[hole]
      );

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

  return { tallyBoard, result: () => ({ wins, ties, boards }) };
};

export default createBoardTally;
