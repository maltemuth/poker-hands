import { readFileSync } from "fs";

import { Hand, HandType, Card, Suit, Value } from "../../src/rust/node";

describe("retrieve best hands", () => {
  test("success on training data with WASM", () => {
    const trainingDataRaw = readFileSync(
      __dirname + "/poker-hand-testing.data"
    );

    const lineSuitToSuit = (lineSuit: string): Suit => {
      if (lineSuit === "1") return "h";
      if (lineSuit === "2") return "s";
      if (lineSuit === "3") return "d";
      if (lineSuit === "4") return "c";
      throw new Error("Invalid suit: " + lineSuit);
    };

    const lineValueToValue = (lineValue: string): Value => {
      if (lineValue === "1") return Value.Ace;
      if (lineValue === "2") return Value.Two;
      if (lineValue === "3") return Value.Three;
      if (lineValue === "4") return Value.Four;
      if (lineValue === "5") return Value.Five;
      if (lineValue === "6") return Value.Six;
      if (lineValue === "7") return Value.Seven;
      if (lineValue === "8") return Value.Eight;
      if (lineValue === "9") return Value.Nine;
      if (lineValue === "10") return Value.Ten;
      if (lineValue === "11") return Value.Jack;
      if (lineValue === "12") return Value.Queen;
      if (lineValue === "13") return Value.King;
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
        ].map(([lineSuit, lineValue]) =>
          Card.new(lineSuitToSuit(lineSuit), lineValueToValue(lineValue))
        );

        const handType = lineResultToHandType(result);

        return {
          cards,
          handType,
        };
      });

    console.log(`Loaded ${trainingLines.length} training lines.`);

    const before = Date.now().valueOf();

    trainingLines.forEach(({ cards, handType }, line) => {
      expect([line, Hand.new(cards).get_best_hand().hand_type()]).toEqual([
        line,
        handType,
      ]);
    });

    const elapsed = Date.now().valueOf() - before;

    console.log(
      `${trainingLines.length} hands / ${elapsed} ms / ${
        trainingLines.length / elapsed
      } hands/ms`
    );
  });
});
