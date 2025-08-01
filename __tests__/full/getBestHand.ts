import { readFileSync } from "fs";
import getBestHand from "../../src/model/hand/getBestHand";
import { Suit, Value } from "../../src/model/card/Card";
import { HandType } from "../../src/model/hand/Hand";

import {
  Hand,
  HandType as RustHandType,
  Card,
  Suit as RustSuit,
  Value as RustValue,
} from "../../src/rust/node";

describe("retrieve best hands", () => {
  test("success on training data", () => {
    const trainingDataRaw = readFileSync(
      __dirname + "/poker-hand-testing.data"
    );

    const lineSuitToSuit = (lineSuit: string): Suit => {
      if (lineSuit === "1") return Suit.hearts;
      if (lineSuit === "2") return Suit.spades;
      if (lineSuit === "3") return Suit.diamonds;
      if (lineSuit === "4") return Suit.clubs;
      throw new Error("Invalid suit: " + lineSuit);
    };

    const lineValueToValue = (lineValue: string): Value => {
      if (lineValue === "1") return Value.ace;
      if (lineValue === "2") return Value.two;
      if (lineValue === "3") return Value.three;
      if (lineValue === "4") return Value.four;
      if (lineValue === "5") return Value.five;
      if (lineValue === "6") return Value.six;
      if (lineValue === "7") return Value.seven;
      if (lineValue === "8") return Value.eight;
      if (lineValue === "9") return Value.nine;
      if (lineValue === "10") return Value.ten;
      if (lineValue === "11") return Value.jack;
      if (lineValue === "12") return Value.queen;
      if (lineValue === "13") return Value.king;
      throw new Error("Invalid value: " + lineValue);
    };

    const lineResultToHandType = (lineResult: string): HandType => {
      if (lineResult === "0") return HandType.HighCard;
      if (lineResult === "1") return HandType.Pair;
      if (lineResult === "2") return HandType.TwoPair;
      if (lineResult === "3") return HandType.ThreeOfAKind;
      if (lineResult === "4") return HandType.Straight;
      if (lineResult === "5") return HandType.Flush;
      if (lineResult === "6") return HandType.FullHouse;
      if (lineResult === "7") return HandType.FourOfAKind;
      if (lineResult === "8") return HandType.StraightFlush;
      if (lineResult === "9") return HandType.RoyalFlush;
      throw new Error("Invalid HandType: " + lineResult);
    };

    const trainingLines = trainingDataRaw
      .toString()
      .split("\r\n")
      .slice(0, 1000)
      .map((line) => line.split(","))
      .map((line) => {
        const [
          suitOne,
          valueOne,
          suitTwo,
          valueTwo,
          suitThree,
          valueThree,
          suitFour,
          valueFour,
          suitFive,
          valueFive,
          result,
        ] = line;

        const cards = [
          [suitOne, valueOne],
          [suitTwo, valueTwo],
          [suitThree, valueThree],
          [suitFour, valueFour],
          [suitFive, valueFive],
        ].map(([lineSuit, lineValue]) => ({
          suit: lineSuitToSuit(lineSuit),
          value: lineValueToValue(lineValue),
        }));

        const handType = lineResultToHandType(result);

        return {
          cards,
          handType,
        };
      });
    // .slice(0, 1000);

    console.log(`Loaded ${trainingLines.length} training lines.`);

    const before = Date.now().valueOf();

    trainingLines.forEach(({ cards, handType }, index) => {
      expect([index, getBestHand(cards).type]).toEqual([index, handType]);
    });

    const elapsed = Date.now().valueOf() - before;

    console.log(
      `${trainingLines.length} hands / ${elapsed} ms / ${
        trainingLines.length / elapsed
      } hands/ms`
    );
  });
});
