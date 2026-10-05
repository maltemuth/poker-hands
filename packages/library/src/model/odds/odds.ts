import { Card } from "../card/Card.js";
import create from "../deck/create.js";
import without from "../card/without.js";
import assertUnique from "../card/assertUnique.js";
import type { Hole, HoleOdds, ProgressCallback } from "./HoleOdds.js";
import tallyBoards from "./tallyBoards.js";
import { assertBoardSize, assertHoleSize } from "./assertSizes.js";

export type { Hole, HoleOdds, ProgressCallback };

export type OddsOptions = {
  progress?: ProgressCallback;
};

/**
 * Calculates the exact winning odds of each player's hole cards.
 *
 * Every way to complete the board with the remaining cards is evaluated, so
 * the results are exact. Before the flop, that is up to 2,118,760 boards
 * (a single hole) and takes at most about 0.2 seconds.
 *
 * @param holes - Array of hole cards for each player. Each player's hole cards
 *                should be provided as an array of Card objects.
 * @param board - Array of community cards already on the board (0 to 5)
 * @param options - Optional settings:
 *   - progress: Called with the share of boards done, see ProgressCallback
 * @returns Array of HoleOdds objects, one for each player's hole cards,
 *          containing wins, ties, and win/tie probabilities.
 *
 * @throws {Error} If no hole cards are provided, a hole doesn't have exactly
 *   two cards, the board has more than five, or a card is used twice.
 *
 * @example
 * ```typescript
 * import cards from '../card/cards.js';
 * import odds from './odds.js';
 *
 * // Calculate odds for two players with given hole cards and no board
 * const hole1 = cards('As', 'Ks');
 * const hole2 = cards('Qd', 'Jd');
 * const results = odds([hole1, hole2]);
 *
 * // results[0] contains odds for hole1, results[1] for hole2
 * console.log(`Player 1 win chance: ${(results[0].winChance * 100).toFixed(2)}%`);
 * console.log(`Player 2 win chance: ${(results[1].winChance * 100).toFixed(2)}%`);
 * ```
 *
 * @example
 * ```typescript
 * // With a progress callback
 * const results = odds([hole1, hole2], [], {
 *   progress: (progress: number) => console.log(`Progress: ${Math.round(progress * 100)}%`)
 * });
 * ```
 */
const odds = (
  holes: Hole[],
  board: Card[] = [],
  options: OddsOptions = {}
): HoleOdds[] => {
  if (holes.length === 0) {
    throw new Error("Cannot calculate odds without any holes.");
  }
  holes.forEach(assertHoleSize);
  assertBoardSize(board);
  assertUnique([...board, ...holes.flat()]);

  const rest = without(create(), ...holes.flat(), ...board);
  const { wins, ties, boards } = tallyBoards(
    holes,
    board,
    rest,
    options.progress
  );

  return holes.map((hole, index) => ({
    hole,
    wins: wins[index],
    ties: ties[index],
    winChance: wins[index] / boards,
    tieChance: ties[index] / boards,
  }));
};

export default odds;
