import { Card } from "../card/Card";
import create from "../deck/create";
import without from "../card/without";
import combinations from "../combinatorics/combinations";
import toString from "../card/toString";
import getBestHand from "../hand/getBestHand";
import isBetterThan from "../hand/isBetterThan";
import hasEqualValue from "../hand/hasEqualValue";
import assertUnique from "../card/assertUnique";
import { ProgressCallback } from "./odds";

export type Hole = Card[];

export interface HoleOdds {
  hole: Hole;
  wins: number;
  ties: number;
  winChance: number;
  tieChance: number;
}

/**
 * Creates a unique identifier for a hole (set of hole cards)
 * Used as keys in the results object to track wins/ties for each hole
 */
const holeIdentifier = (hole: Hole) => hole.map(toString).join("-");

// const generateHoles = (deck: Card[], length: number): Hole[] => {};

/**
 * Calculates exact poker odds by exhaustively simulating all possible board combinations.
 * This method provides 100% accurate results but can be computationally expensive
 * for large numbers of unknown cards.
 *
 * The algorithm works by:
 * 1. Creating a full deck and removing known cards (hole cards and board)
 * 2. Generating all possible remaining board combinations
 * 3. For each possible board:
 *    a. Complete the board with the random cards
 *    b. Evaluate each player's best hand
 *    c. Determine winners and ties
 *    d. Update statistics for each hole
 * 4. Calculate final win/tie probabilities
 *
 * Time complexity: O(C * H * E) where:
 *   C = number of possible board combinations
 *   H = number of holes
 *   E = complexity of hand evaluation
 *
 * Space complexity: O(H) for storing results
 *
 * @param holes Array of hole cards for each player
 * @param board Currently revealed board cards (empty if pre-flop)
 * @param progressCallback Optional callback to report progress (0 to 1)
 * @returns Array of odds for each hole including wins, ties, and probabilities
 *
 * @throws {Error} If no holes are provided or if cards are duplicated
 *
 * @example
 * // Calculate odds for two players with all cards known
 * const hole1 = [{ suit: 'hearts', value: 14 }, { suit: 'spades', value: 13 }]; // A, K
 * const hole2 = [{ suit: 'diamonds', value: 14 }, { suit: 'clubs', value: 12 }]; // A, Q
 * const board = [{ suit: 'hearts', value: 10 }, { suit: 'spades', value: 9 }, { suit: 'diamonds', value: 8 }]; // T, 9, 8
 *
 * const odds = exhaustive([hole1, hole2], board);
 * // Returns odds for each hole including win/tie probabilities
 */
const exhaustive = (
  holes: Hole[],
  board: Card[] = [],
  progressCallback?: ProgressCallback
  // unknownHoles: number = 0
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

  // Generate all possible remaining board combinations
  const possibleRestBoards = combinations(
    deckWithoutKnownBoard,
    5 - board.length // Need 5 cards total for the board
  );

  const totalAmountOfBoards = possibleRestBoards.length;

  // Initialize results structure to track wins and ties for each hole
  const results: Record<string, { hole: Hole; ties: number; wins: number }> =
    holes.reduce(
      (partial, hole) => ({
        ...partial,
        [holeIdentifier(hole)]: {
          hole,
          ties: 0,
          wins: 0,
        },
      }),
      {} as Record<string, { hole: Hole; ties: number; wins: number }>
    );

  // Simulate each possible board
  possibleRestBoards.forEach((restBoard, boardIndex) => {
    // Report progress periodically (every 100 boards) to avoid callback overhead,
    // and always on the last one so callers see completion
    if (
      progressCallback &&
      ((boardIndex + 1) % 100 === 0 || boardIndex + 1 === totalAmountOfBoards)
    ) {
      progressCallback((boardIndex + 1) / totalAmountOfBoards);
    }

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
  });

  // Convert raw counts to probabilities
  const resultsWithChances = Object.keys(results).reduce(
    (partial, id) => ({
      ...partial,
      [id]: {
        ...results[id],
        winChance: results[id].wins / totalAmountOfBoards,
        tieChance: results[id].ties / totalAmountOfBoards,
      },
    }),
    {} as Record<
      string,
      {
        hole: Hole;
        ties: number;
        wins: number;
        winChance: number;
        tieChance: number;
      }
    >
  );

  // Return results in the same order as input holes
  return holes.map((hole) => {
    const result = resultsWithChances[holeIdentifier(hole)] || {
      wins: 0,
      ties: 0,
      winChance: 0,
      tieChance: 0,
    };
    return {
      hole: hole,
      wins: result.wins,
      ties: result.ties,
      winChance: result.winChance,
      tieChance: result.tieChance,
    };
  });
};

export default exhaustive;
