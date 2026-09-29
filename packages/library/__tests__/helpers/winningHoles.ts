import { Card } from "../../src/model/card/Card.js";
import evaluate from "../../src/model/hand/evaluate.js";
import { Hole } from "../../src/model/odds/HoleOdds.js";

/**
 * Determines which holes win on a complete board.
 *
 * @param holes Array of hole cards for each player
 * @param board The complete (5 card) board
 * @returns The indices of all holes sharing the best hand; more than one index means a tie
 */
const winningHoles = (holes: Hole[], board: Card[]): number[] => {
  const ranks = holes.map((hole) => evaluate([...board, ...hole]));
  const best = Math.max(...ranks);

  return ranks.flatMap((rank, index) => (rank === best ? [index] : []));
};

export default winningHoles;
