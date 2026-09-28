import { Card } from "../card/Card";
import create from "../deck/create";
import without from "../card/without";
import combinations from "../combinatorics/combinations";
import assertUnique from "../card/assertUnique";
import { Hole, HoleOdds, ProgressCallback } from "./HoleOdds";
import winningHoles from "./winningHoles";

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

  // Track wins and ties for each hole, in the same order as the input holes
  const wins = holes.map(() => 0);
  const ties = holes.map(() => 0);

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

    const winners = winningHoles(holes, [...board, ...restBoard]);

    // A single winner gets a win, otherwise each tied hole gets a tie
    if (winners.length === 1) {
      wins[winners[0]] += 1;
    } else {
      winners.forEach((index) => (ties[index] += 1));
    }
  });

  // Convert raw counts to probabilities
  return holes.map((hole, index) => ({
    hole,
    wins: wins[index],
    ties: ties[index],
    winChance: wins[index] / totalAmountOfBoards,
    tieChance: ties[index] / totalAmountOfBoards,
  }));
};

export default exhaustive;
