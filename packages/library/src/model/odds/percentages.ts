import { Card } from "../card/Card";
import { HandType } from "../hand/Hand";
import without from "../card/without";
import create from "../deck/create";
import combinations from "../combinatorics/combinations";
import getBestHand from "../hand/getBestHand";
import assertUnique from "../card/assertUnique";

const handTypes = [
  "highCard",
  "pair",
  "twoPair",
  "threeOfAKind",
  "straight",
  "flush",
  "fullHouse",
  "fourOfAKind",
  "straightFlush",
  "royalFlush",
] as const;

/**
 * The name of a hand type, from "highCard" to "royalFlush"
 */
export type HandTypeName = (typeof handTypes)[number];

const mapHandTypeToKey = (type: HandType): HandTypeName => handTypes[type - 1];

/**
 * How often each hand type occurs, for all ten hand types
 */
export type HandPercentages = Record<
  HandTypeName,
  {
    count: number;
    percentage: number;
  }
>;

/**
 * Calculates the probability distribution of all possible poker hand types
 * for a given hole card and board combination.
 *
 * This function performs an exhaustive calculation of all possible board
 * combinations that could be dealt from the remaining deck, and determines
 * what percentage of the time each type of poker hand (from high card to
 * royal flush) would be made.
 *
 * @param hole - The player's hole cards as an array of Card objects
 * @param board - Currently revealed board cards (optional). Defaults to empty array.
 * @param dead - Cards that can no longer appear on the board, e.g. other
 *               players' hole cards (optional). Defaults to empty array.
 * @returns An object mapping hand type names to their occurrence counts
 *          and percentages. Each hand type has:
 *          - count: Number of times this hand type appears
 *          - percentage: Probability of this hand type (0-1)
 *
 * @throws {Error} If a card appears more than once in the hole, board and dead cards.
 *
 * @example
 * ```typescript
 * import cards from '../card/cards';
 * import percentages from './percentages';
 *
 * const hole = cards('As', 'Ks');
 * const board = cards('Ts', 'Js', 'Qs');
 *
 * const results = percentages(hole, board);
 *
 * // Results show probability of each hand type with current hole and board
 * console.log(`Royal flush chance: ${(results.royalFlush.percentage * 100).toFixed(2)}%`);
 * console.log(`Straight flush chance: ${(results.straightFlush.percentage * 100).toFixed(2)}%`);
 * console.log(`Full house chance: ${(results.fullHouse.percentage * 100).toFixed(2)}%`);
 * ```
 *
 * @example
 * ```typescript
 * // With hole cards only (pre-flop)
 * const preFlopResults = percentages(hole);
 * console.log(`Pair chance: ${(preFlopResults.pair.percentage * 100).toFixed(2)}%`);
 * console.log(`High card chance: ${(preFlopResults.highCard.percentage * 100).toFixed(2)}%`);
 * ```
 */
const percentages = (
  hole: Card[],
  board: Card[] = [],
  dead: Card[] = []
): HandPercentages => {
  assertUnique([...hole, ...board, ...dead]);

  const deckWithoutHoleCards = without(create(), ...hole);
  const deckWithoutKnownBoard = without(
    deckWithoutHoleCards,
    ...board,
    ...dead
  );
  const restBoards = combinations(deckWithoutKnownBoard, 5 - board.length);

  const totalNumberOfSimulations = restBoards.length;

  const results = handTypes.reduce(
    (partial, type) => ({
      ...partial,
      [type]: {
        count: 0,
        percentage: 0,
      },
    }),
    {} as HandPercentages
  );

  restBoards.forEach((rest) => {
    const hand = getBestHand([...hole, ...board, ...rest]);
    if (hand) {
      const key = mapHandTypeToKey(hand.type);
      results[key].count += 1;
    }
  });

  handTypes.forEach((type) => {
    results[type].percentage = results[type].count / totalNumberOfSimulations;
  });

  return results;
};

export default percentages;
