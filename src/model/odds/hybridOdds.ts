import { Card } from "../card/Card";
import create from "../deck/create";
import without from "../card/without";
import assertUnique from "../card/assertUnique";
import odds from "./odds";
import monteCarloOdds from "./monteCarloOdds";
import combinationCount from "../combinatorics/combinationCount";

export type Hole = Card[];

export interface HoleOdds {
  hole: Hole;
  wins: number;
  ties: number;
  winChance: number;
  tieChance: number;
  // Confidence interval for statistical accuracy (only in Monte Carlo results)
  winChanceError?: number;
  tieChanceError?: number;
}

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

/**
 * Calculate poker odds using either exhaustive or Monte Carlo approach based on performance
 * @param holes Array of hole cards for each player
 * @param board Currently revealed board cards
 * @param sampleSize Number of random simulations to run for Monte Carlo (default: 10000)
 * @param threshold Maximum number of combinations to use exhaustive algorithm (default: 10000)
 */
const hybridOdds = (
  holes: Hole[],
  board: Card[] = [],
  sampleSize: number = 10000,
  threshold: number = 10000
): HoleOdds[] => {
  if (holes.length === 0) {
    throw new Error("Cannot calculate odds without any holes.");
  }

  // Calculate the number of combinations the exhaustive algorithm would need to check
  const combinationCount = calculateBoardCombinations(holes, board);

  // If the number of combinations is below the threshold, use the exhaustive algorithm
  if (combinationCount <= threshold) {
    return odds(holes, board);
  } else {
    // Otherwise, use the Monte Carlo algorithm
    return monteCarloOdds(holes, board, sampleSize);
  }
};

export { calculateBoardCombinations };
export default hybridOdds;
