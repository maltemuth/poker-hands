import { Card } from "../card/Card";
import create from "../deck/create";
import without from "../card/without";
import getBestHand from "../hand/getBestHand";
import isBetterThan from "../hand/isBetterThan";
import hasEqualValue from "../hand/hasEqualValue";
import assertUnique from "../card/assertUnique";
import shuffle from "../deck/shuffle";
import { ProgressCallback } from "./odds";

export type Hole = Card[];

export interface HoleOdds {
  hole: Hole;
  wins: number;
  ties: number;
  winChance: number;
  tieChance: number;
  // Confidence interval for statistical accuracy (95% confidence)
  winChanceError?: number;
  tieChanceError?: number;
}

/**
 * Creates a unique identifier for a hole (set of hole cards)
 * Used as keys in the results object to track wins/ties for each hole
 */
const holeIdentifier = (hole: Hole) =>
  hole.map((card) => `${card.suit}${card.value}`).join("-");

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

  // Initialize results structure to track wins and ties for each hole
  const results: Record<string, { wins: number; ties: number }> = {} as Record<
    string,
    { wins: number; ties: number }
  >;
  holes.forEach((hole) => {
    results[holeIdentifier(hole)] = { wins: 0, ties: 0 };
  });

  // Run Monte Carlo simulations
  for (let i = 0; i < sampleSize; i++) {
    // Report progress periodically (every 100 simulations) to avoid callback overhead
    if (progressCallback && (i + 1) % 100 === 0) {
      progressCallback((i + 1) / sampleSize);
    }

    // Create a shuffled copy of the remaining deck for this simulation
    const shuffledDeck = shuffle([...deckWithoutKnownBoard]);

    // Take the cards needed to complete the board
    const cardsNeeded = 5 - board.length;
    const restBoard = shuffledDeck.slice(0, cardsNeeded);

    // Create the complete board for this simulation
    const completeBoard = [...board, ...restBoard];

    // Evaluate each player's best hand with the current board
    const hands = holes.map((hole) => ({
      id: holeIdentifier(hole),
      hand: getBestHand([...completeBoard, ...hole]),
    }));

    // Sort hands to determine the winner (better hands come first)
    const sortedHands = hands.sort((a, b) => {
      // Handle edge cases where hands might be null (shouldn't happen in valid poker)
      if (!a.hand && !b.hand) return 0;
      if (!a.hand) return +1; // Null hands are considered worse
      if (!b.hand) return -1; // Null hands are considered worse

      // Compare valid hands
      if (isBetterThan(a.hand, b.hand)) return -1; // a is better
      if (hasEqualValue(a.hand, b.hand)) return 0; // Equal value
      return +1; // b is better
    });

    // Find all hands that tie with the best hand
    const first = sortedHands[0];
    const ties = sortedHands.filter(({ hand }) => {
      // Handle null hands
      if (!first.hand && !hand) return true; // Both null = tie
      if (!first.hand || !hand) return false; // One null = no tie

      // Both hands are valid - check for tie
      return hasEqualValue(first.hand, hand);
    });

    // Update results based on whether there's a single winner or ties
    if (ties.length === 1) {
      // Single winner
      results[first.id].wins += 1;
    } else {
      // Multiple ties - each tied hand gets a tie point
      ties.forEach((tie) => {
        results[tie.id].ties += 1;
      });
    }
  }

  // Calculate final odds with confidence intervals using binomial distribution
  const zScore = 1.96; // Z-score for 95% confidence interval
  const resultsWithChances = Object.keys(results).reduce(
    (partial, id) => ({
      ...partial,
      [id]: {
        hole: holes.find((h) => holeIdentifier(h) === id) || [],
        ...results[id],
        winChance: results[id].wins / sampleSize,
        tieChance: results[id].ties / sampleSize,
        // Calculate margin of error for binomial distribution
        // Formula: z * sqrt(p * (1-p) / n)
        winChanceError:
          zScore *
          Math.sqrt(
            ((results[id].wins / sampleSize) *
              (1 - results[id].wins / sampleSize)) /
              sampleSize
          ),
        tieChanceError:
          zScore *
          Math.sqrt(
            ((results[id].ties / sampleSize) *
              (1 - results[id].ties / sampleSize)) /
              sampleSize
          ),
      },
    }),
    {} as Record<string, HoleOdds>
  );

  // Return results in the same order as input holes
  return holes.map((hole) => {
    const key = holeIdentifier(hole);
    return resultsWithChances[key];
  });
};

export default monteCarloOdds;
