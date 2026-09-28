import { Card } from "../card/Card";
import getBestHand from "../hand/getBestHand";
import isBetterThan from "../hand/isBetterThan";
import hasEqualValue from "../hand/hasEqualValue";
import { Hole } from "./HoleOdds";

/**
 * Determines which holes win on a complete board.
 *
 * @param holes Array of hole cards for each player
 * @param board The complete (5 card) board
 * @returns The indices of all holes sharing the best hand; more than one index means a tie
 */
const winningHoles = (holes: Hole[], board: Card[]): number[] => {
  const hands = holes.map((hole) => getBestHand([...board, ...hole]));

  return hands.reduce((winners, hand, index) => {
    if (!hand) return winners;
    const best = winners.length > 0 ? hands[winners[0]] : null;
    if (!best || isBetterThan(hand, best)) return [index];
    if (hasEqualValue(hand, best)) return [...winners, index];
    return winners;
  }, [] as number[]);
};

export default winningHoles;
