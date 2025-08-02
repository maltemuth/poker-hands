import { Card } from "../card/Card";
import create from "../deck/create";
import without from "../card/without";
import getBestHand from "../hand/getBestHand";
import isBetterThan from "../hand/isBetterThan";
import hasEqualValue from "../hand/hasEqualValue";
import assertUnique from "../card/assertUnique";
import shuffle from "../deck/shuffle";

export type Hole = Card[];

export interface HoleOdds {
  hole: Hole;
  wins: number;
  ties: number;
  winChance: number;
  tieChance: number;
  // Confidence interval for statistical accuracy
  winChanceError?: number;
  tieChanceError?: number;
}

const holeIdentifier = (hole: Hole) =>
  hole.map((card) => `${card.suit}${card.value}`).join("-");

/**
 * Calculate poker odds using Monte Carlo simulation for improved performance
 * @param holes Array of hole cards for each player
 * @param board Currently revealed board cards
 * @param sampleSize Number of random simulations to run (default: 10000)
 */
const monteCarloOdds = (
  holes: Hole[],
  board: Card[] = [],
  sampleSize: number = 10000
): HoleOdds[] => {
  if (holes.length === 0) {
    throw new Error("Cannot calculate odds without any holes.");
  }

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

  // Initialize results
  const results: Record<string, { wins: number; ties: number }> = {};
  holes.forEach((hole) => {
    results[holeIdentifier(hole)] = { wins: 0, ties: 0 };
  });

  // Run Monte Carlo simulations
  for (let i = 0; i < sampleSize; i++) {
    // Create a shuffled copy of the remaining deck
    const shuffledDeck = shuffle([...deckWithoutKnownBoard]);

    // Take cards needed to complete the board
    const cardsNeeded = 5 - board.length;
    const restBoard = shuffledDeck.slice(0, cardsNeeded);

    // Create complete board
    const completeBoard = [...board, ...restBoard];

    // Evaluate all hands
    const hands = holes.map((hole) => ({
      id: holeIdentifier(hole),
      hand: getBestHand([...completeBoard, ...hole]),
    }));

    // Sort hands to determine winner (handling null values)
    const sortedHands = hands.sort((a, b) => {
      // Handle null hands (shouldn't happen in valid poker hands)
      if (!a.hand && !b.hand) return 0;
      if (!a.hand) return +1;
      if (!b.hand) return -1;

      // Both hands are valid
      if (isBetterThan(a.hand!, b.hand!)) return -1;
      if (hasEqualValue(a.hand!, b.hand!)) return 0;
      return +1;
    });

    // Determine winner or tie (handling null values)
    const first = sortedHands[0];
    const ties = sortedHands.filter(({ hand }) => {
      // Handle null hands
      if (!first.hand && !hand) return true;
      if (!first.hand || !hand) return false;

      // Both hands are valid
      return hasEqualValue(first.hand!, hand!);
    });

    if (ties.length === 1) {
      results[first.id].wins += 1;
    } else {
      ties.forEach((tie) => {
        results[tie.id].ties += 1;
      });
    }
  }

  // Calculate final odds with confidence intervals
  const zScore = 1.96; // 95% confidence interval
  const resultsWithChances = Object.keys(results).reduce(
    (partial, id) => ({
      ...partial,
      [id]: {
        ...results[id],
        winChance: results[id].wins / sampleSize,
        tieChance: results[id].ties / sampleSize,
        // Calculate margin of error for binomial distribution
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
    {}
  );

  return holes.map((hole) => ({
    hole,
    ...resultsWithChances[holeIdentifier(hole)],
  }));
};

export default monteCarloOdds;
