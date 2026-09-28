import { Card } from "../card/Card";
import create from "../deck/create";
import without from "../card/without";
import assertUnique from "../card/assertUnique";
import monteCarloOdds from "./monteCarloOdds";
import combinationCount from "../combinatorics/combinationCount";
import exhaustive from "./exhaustive";
import { Hole, HoleOdds, ProgressCallback } from "./HoleOdds";

export { Hole, HoleOdds, ProgressCallback };

/**
 * Calculates the number of possible board combinations for the given holes and board
 * @param holes Array of hole cards for each player
 * @param board Currently revealed board cards
 * @returns The number of possible board combinations
 */
const calculateBoardCombinations = (
  holes: Hole[],
  board: Card[] = []
): number => {
  // Validate inputs
  const allCardsInHoles = holes.reduce((flat, hole) => flat.concat(hole), []);
  assertUnique([...board, ...allCardsInHoles]);

  // Create deck and remove known cards
  const deck = create();
  const deckWithoutKnownHoleCards = holes.reduce(
    (remain, hole) => without(remain, ...hole),
    deck
  );
  const deckWithoutKnownBoard = without(deckWithoutKnownHoleCards, ...board);

  // Calculate number of combinations
  const cardsNeeded = 5 - board.length;
  return combinationCount(deckWithoutKnownBoard.length, cardsNeeded);
};

export type OddsOptions = (
  | {
      mode: "auto";
      threshold?: number;
    }
  | { mode: "exhaustive" }
  | { mode: "monteCarlo"; sampleSize?: number }
) & {
  progress?: ProgressCallback;
};
/**
 * Calculates winning odds for poker hands using either exhaustive or Monte Carlo simulation.
 *
 * This function determines the probability of each player's hole cards winning
 * against other players' hole cards, given the current board cards. It automatically
 * selects the most appropriate calculation method based on the number of possible
 * combinations to evaluate.
 *
 * @param holes - Array of hole cards for each player. Each player's hole cards
 *                should be provided as an array of Card objects.
 * @param board - Currently revealed board cards (optional). Defaults to empty array.
 * @param options - Configuration options for odds calculation:
 *   - mode: Calculation method ("auto", "exhaustive", or "monteCarlo")
 *   - threshold: For "auto" mode, maximum combinations for exhaustive calculation
 *   - sampleSize: For "monteCarlo" mode, number of simulations to run
 *   - progress: Optional callback function to report calculation progress
 * @returns Array of HoleOdds objects, one for each player's hole cards,
 *          containing wins, ties, and win/tie probabilities.
 *
 * @throws {Error} If no hole cards are provided.
 *
 * @example
 * ```typescript
 * import cards from '../card/cards';
 * import odds from './odds';
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
 * // With progress callback and Monte Carlo simulation
 * const options = {
 *   mode: "monteCarlo" as const,
 *   sampleSize: 50000,
 *   progress: (progress: number) => console.log(`Progress: ${Math.round(progress * 100)}%`)
 * };
 *
 * const results = odds([hole1, hole2], [], options);
 * ```
 */
const odds = (
  holes: Hole[],
  board: Card[] = [],
  options: OddsOptions = { mode: "auto", threshold: 10000 }
): HoleOdds[] => {
  if (holes.length === 0) {
    throw new Error("Cannot calculate odds without any holes.");
  }
  if (options.mode === "auto") {
    const threshold = options.threshold || 10000;
    // Calculate the number of combinations the exhaustive algorithm would need to check
    const combinationCount = calculateBoardCombinations(holes, board);

    // If the number of combinations is below the threshold, use the exhaustive algorithm
    if (combinationCount <= threshold) {
      return exhaustive(holes, board, options.progress);
    } else {
      // Otherwise, use the Monte Carlo algorithm
      return monteCarloOdds(holes, board, threshold, options.progress);
    }
  }

  if (options.mode === "monteCarlo") {
    const sampleSize = options.sampleSize || 10000;
    return monteCarloOdds(holes, board, sampleSize, options.progress);
  }

  return exhaustive(holes, board, options.progress);
};

export { calculateBoardCombinations };
export default odds;
