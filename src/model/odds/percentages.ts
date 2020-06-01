import { Card } from "../card/Card";
import { HandType } from "../hand/Hand";
import without from "../card/without";
import create from "../deck/create";
import combinations from "../combinatorics/combinations";
import getBestHand from "../hand/getBestHand";

const mapHandTypeToKey = (type: HandType) => handTypes[type - 1];

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
];

export interface HandPercentages {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

const percentages = (hole: Card[], board: Card[] = []): HandPercentages => {
  const deckWithoutHoleCards = without(create(), ...hole);
  const deckWithoutKnownBoard = without(deckWithoutHoleCards, ...board);
  const restBoards = combinations(deckWithoutKnownBoard, 5 - board.length);

  const totalNumberOfSimulations = restBoards.length;

  const results: HandPercentages = handTypes.reduce(
    (partial, type) => ({
      ...partial,
      [type]: {
        count: 0,
        percentage: 0,
      },
    }),
    {}
  );

  restBoards.forEach((rest) => {
    const hand = getBestHand([...hole, ...board, ...rest]);
    const key = mapHandTypeToKey(hand.type);

    results[key].count += 1;
  });

  handTypes.forEach((type) => {
    results[type].percentage = results[type].count / totalNumberOfSimulations;
  });

  return results;
};

export default percentages;
