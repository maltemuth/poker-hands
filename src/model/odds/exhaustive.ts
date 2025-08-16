import { Card } from "../card/Card";
import create from "../deck/create";
import without from "../card/without";
import combinations from "../combinatorics/combinations";
import toString from "../card/toString";
import getBestHand from "../hand/getBestHand";
import isBetterThan from "../hand/isBetterThan";
import hasEqualValue from "../hand/hasEqualValue";
import assertUnique from "../card/assertUnique";

export type Hole = Card[];

export interface HoleOdds {
  hole: Hole;
  wins: number;
  ties: number;
  winChance: number;
  tieChance: number;
}

const holeIdentifier = (hole: Hole) => hole.map(toString).join("-");

// const generateHoles = (deck: Card[], length: number): Hole[] => {};

/**
 * returns the odds of winning each of the given holes has with the given board already revealed,
 * by simulating all possible boards
 * @param holes
 * @param board
 */
const exhaustive = (
  holes: Hole[],
  board: Card[] = []
  // unknownHoles: number = 0
): HoleOdds[] => {
  if (holes.length === 0) {
    throw new Error("Cannot calculate odds without any holes.");
  }

  const initialTime = Date.now().valueOf();

  const allCardsInHoles = holes.reduce((flat, hole) => flat.concat(hole), []);

  assertUnique([...board, ...allCardsInHoles]);

  const deck = create();

  const deckWithoutKnownHoleCards = holes.reduce(
    (remain, hole) => without(remain, ...hole),
    deck
  );

  const deckWithoutKnownBoard = without(deckWithoutKnownHoleCards, ...board);

  const possibleRestBoards = combinations(
    deckWithoutKnownBoard,
    5 - board.length
  );

  const totalAmountOfBoards = possibleRestBoards.length;

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

  possibleRestBoards.forEach((restBoard, boardIndex) => {
    const completeBoard = [...board, ...restBoard];
    const beforeBestHand = Date.now().valueOf();
    const hands = holes.map((hole) => ({
      id: holeIdentifier(hole),
      hand: getBestHand([...completeBoard, ...hole]),
    }));

    const sortedHands = hands.sort((a, b) => {
      // Handle null hands
      if (!a.hand && !b.hand) return 0;
      if (!a.hand) return +1;
      if (!b.hand) return -1;

      // Both hands are valid
      if (isBetterThan(a.hand!, b.hand!)) return -1;
      if (hasEqualValue(a.hand!, b.hand!)) return 0;
      return +1;
    });

    const first = sortedHands[0];
    const ties = sortedHands.filter(({ hand }, index) => {
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
  });

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
