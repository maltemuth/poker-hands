import getBestHand from "../../../../src/model/hand/getBestHand.js";
import cards from "../../../../src/model/card/cards.js";
import toString from "../../../../src/model/card/toString.js";
import { HandType } from "../../../../src/model/hand/Hand.js";

// the full test suite only covers five-card hands, so extra cards are tested here
describe("best hand from seven cards", () => {
  test.each(["Jd", "Qc", "Ks", "Ad", "Tc"])(
    "a royal flush with an extra %s stays a royal flush",
    (extra) => {
      const hand = getBestHand(
        cards("Ah", "Kh", "Qh", "Jh", "Th", extra, "2c")
      );

      expect(hand!.type).toEqual(HandType.RoyalFlush);
    }
  );

  test("an ace-high straight with a paired queen is a straight", () => {
    const hand = getBestHand(cards("Ts", "Jd", "Qc", "Qh", "Ks", "Ad", "2c"));

    expect(hand!.type).toEqual(HandType.Straight);
    expect(hand!.value()).toEqual(14);
  });

  test.each([
    ["high card", ["Kd", "2c", "Ah", "7s", "9h", "4d", "Jc"]],
    ["straight", ["9d", "Tc", "6h", "8s", "7h", "2d", "Kc"]],
    ["flush", ["Kh", "2h", "Ac", "7h", "9h", "4d", "3h"]],
  ])("leaves the order of its input unchanged: %s", (_, input) => {
    const hand = cards(...input);
    getBestHand(hand);

    expect(hand.map(toString)).toEqual(input);
  });
});
