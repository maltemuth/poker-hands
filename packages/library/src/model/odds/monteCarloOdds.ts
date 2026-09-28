import { Card } from "../card/Card";
import create from "../deck/create";
import without from "../card/without";
import assertUnique from "../card/assertUnique";
import shuffle from "../deck/shuffle";
import { Hole, HoleOdds, ProgressCallback } from "./HoleOdds";
import winningHoles from "./winningHoles";

// Z-score for 95% confidence interval
const zScore = 1.96;

/**
 * Margin of error of a binomial proportion
 * Formula: z * sqrt(p * (1-p) / n)
 */
const marginOfError = (count: number, sampleSize: number) => {
  const p = count / sampleSize;
  return zScore * Math.sqrt((p * (1 - p)) / sampleSize);
};

/**
 * Calculate poker odds using Monte Carlo simulation for improved performance.
 * This method provides approximate results with statistical confidence intervals,
 * making it much faster than exhaustive enumeration while maintaining accuracy.
 *
 * The algorithm works by:
 * 1. Creating a full deck and removing known cards (hole cards and board)
 * 2. Running a specified number of random simulations (sampleSize)
 * 3. For each simulation:
 *    a. Shuffle the remaining deck
 *    b. Draw random cards to complete the board
 *    c. Evaluate each player's best hand
 *    d. Determine winners and ties
 *    e. Update statistics for each hole
 * 4. Calculate final win/tie probabilities with confidence intervals
 *
 * Time complexity: O(S * H * E) where:
 *   S = sampleSize (number of simulations)
 *   H = number of holes
 *   E = complexity of hand evaluation
 *
 * Space complexity: O(H) for storing results
 *
 * @param holes Array of hole cards for each player
 * @param board Currently revealed board cards (empty if pre-flop)
 * @param sampleSize Number of random simulations to run (default: 10000)
 * @param progressCallback Optional callback to report progress (0 to 1)
 * @returns Array of odds for each hole including wins, ties, probabilities, and confidence intervals
 *
 * @throws {Error} If no holes are provided or if cards are duplicated
 *
 * @example
 * // Calculate odds for two players with Monte Carlo simulation
 * const hole1 = [{ suit: 'hearts', value: 14 }, { suit: 'spades', value: 13 }]; // A, K
 * const hole2 = [{ suit: 'diamonds', value: 14 }, { suit: 'clubs', value: 12 }]; // A, Q
 * const board = [{ suit: 'hearts', value: 10 }, { suit: 'spades', value: 9 }, { suit: 'diamonds', value: 8 }]; // T, 9, 8
 *
 * const odds = monteCarloOdds([hole1, hole2], board, 10000);
 * // Returns odds for each hole with win/tie probabilities and confidence intervals
 */
const monteCarloOdds = (
  holes: Hole[],
  board: Card[] = [],
  sampleSize: number = 10000,
  progressCallback?: ProgressCallback
): HoleOdds[] => {
  // Validate input
  if (holes.length === 0) {
    throw new Error("Cannot calculate odds without any holes.");
  }

  // Check for duplicate cards across all holes and board
  const allCardsInHoles = holes.reduce((flat, hole) => flat.concat(hole), []);
  assertUnique([...board, ...allCardsInHoles]);

  // Create a full deck and remove known cards
  const deck = create();
  const deckWithoutKnownHoleCards = holes.reduce(
    (remain, hole) => without(remain, ...hole), // Remove all hole cards
    deck
  );
  const deckWithoutKnownBoard = without(deckWithoutKnownHoleCards, ...board); // Remove board cards

  // Track wins and ties for each hole, in the same order as the input holes
  const wins = holes.map(() => 0);
  const ties = holes.map(() => 0);
  const cardsNeeded = 5 - board.length;

  // Run Monte Carlo simulations
  for (let i = 0; i < sampleSize; i++) {
    // Report progress periodically (every 100 simulations) to avoid callback overhead,
    // and always on the last one so callers see completion
    if (progressCallback && ((i + 1) % 100 === 0 || i + 1 === sampleSize)) {
      progressCallback((i + 1) / sampleSize);
    }

    // Take the cards needed to complete the board from a shuffled copy of the remaining deck
    const restBoard = shuffle([...deckWithoutKnownBoard]).slice(0, cardsNeeded);

    const winners = winningHoles(holes, [...board, ...restBoard]);

    // A single winner gets a win, otherwise each tied hole gets a tie
    if (winners.length === 1) {
      wins[winners[0]] += 1;
    } else {
      winners.forEach((index) => (ties[index] += 1));
    }
  }

  // Calculate final odds with 95% confidence intervals
  return holes.map((hole, index) => ({
    hole,
    wins: wins[index],
    ties: ties[index],
    winChance: wins[index] / sampleSize,
    tieChance: ties[index] / sampleSize,
    winChanceError: marginOfError(wins[index], sampleSize),
    tieChanceError: marginOfError(ties[index], sampleSize),
  }));
};

export default monteCarloOdds;
