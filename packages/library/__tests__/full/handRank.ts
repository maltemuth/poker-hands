import handRank from "../../src/model/hand/handRank.js";
import getBestHand from "../../src/model/hand/getBestHand.js";
import isBetterThan from "../../src/model/hand/isBetterThan.js";
import hasEqualValue from "../../src/model/hand/hasEqualValue.js";
import toString from "../../src/model/card/toString.js";
import { Card } from "../../src/model/card/Card.js";
import { HandInterface } from "../../src/model/hand/Hand.js";
import { randomCards, seededRandom } from "../helpers/randomCards.js";

const random = seededRandom(42);

/**
 * Nine random cards: two holes and a shared board, as in a showdown
 */
const randomShowdown = (): [Card[], Card[]] => {
  const cards = randomCards(random, 9);
  const board = cards.slice(4, 9);
  return [
    [...cards.slice(0, 2), ...board],
    [...cards.slice(2, 4), ...board],
  ];
};

const bestHand = (cards: Card[]): HandInterface => {
  const hand = getBestHand(cards);
  if (!hand) throw new Error(`no hand for ${cards.map(toString).join(" ")}`);
  return hand;
};

// 1 if a is better, -1 if b is better, 0 if they are equally strong
const compareHands = (a: HandInterface, b: HandInterface): number => {
  if (isBetterThan(a, b)) return 1;
  if (isBetterThan(b, a)) return -1;
  return 0;
};

describe("handRank", () => {
  test("orders hands like isBetterThan and hasEqualValue", () => {
    const mismatches: string[] = [];
    let ties = 0;

    for (let i = 0; i < 50_000; i++) {
      const [cardsA, cardsB] = randomShowdown();
      const a = bestHand(cardsA);
      const b = bestHand(cardsB);

      const expected = compareHands(a, b);
      const actual = Math.sign(handRank(a) - handRank(b));
      if (expected === 0) ties++;

      if (
        actual !== expected ||
        (handRank(a) === handRank(b)) !== hasEqualValue(a, b)
      ) {
        mismatches.push(
          `${cardsA.map(toString).join(" ")} vs ${cardsB
            .map(toString)
            .join(" ")}: expected ${expected}, got ${actual}`
        );
      }
    }

    expect(mismatches.slice(0, 10)).toEqual([]);
    // the shared board makes ties common; make sure they are tested
    expect(ties).toBeGreaterThan(1000);
  });
});
