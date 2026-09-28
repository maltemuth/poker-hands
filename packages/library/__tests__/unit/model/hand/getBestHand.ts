import getBestHand from "../../../../src/model/hand/getBestHand";
import cards from "../../../../src/model/card/cards";
import toString from "../../../../src/model/card/toString";
import { HandType } from "../../../../src/model/hand/Hand";

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
});
