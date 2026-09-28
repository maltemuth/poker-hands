import { Card } from "../card/Card";
import getBestHand from "../hand/getBestHand";
import handRank from "../hand/handRank";
import { Hole } from "./HoleOdds";

/**
 * Determines which holes win on a complete board.
 *
 * @param holes Array of hole cards for each player
 * @param board The complete (5 card) board
 * @returns The indices of all holes sharing the best hand; more than one index means a tie
 */
const winningHoles = (holes: Hole[], board: Card[]): number[] => {
  // every hand has a rank above 0, so 0 stands for no hand
  const ranks = holes.map((hole) => {
    const hand = getBestHand([...board, ...hole]);
    return hand ? handRank(hand) : 0;
  });
  const best = Math.max(...ranks);

  return best > 0
    ? ranks.flatMap((rank, index) => (rank === best ? [index] : []))
    : [];
};

export default winningHoles;
