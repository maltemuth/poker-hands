import hasStraight from "../../../../../src/model/hand/detect/hasStraight";
import cards from "../../../../../src/model/card/cards";

describe("detect straights", () => {
  test("four cards are not a straight", () => {
    expect(hasStraight(cards("2d", "3d", "4d", "5d"))).toBe(false);
  });

  test("detect a straight", () => {
    expect(hasStraight(cards("Jh", "Th", "Qh", "8d", "9h"))).toBe(true);
  });

  test("detect a straight starting from ace", () => {
    expect(hasStraight(cards("Ad", "2d", "3d", "4d", "5d"))).toBe(true);
  });

  test("detect a straight from seven cards, out of order", () => {
    expect(hasStraight(cards("8d", "7d", "4d", "5d", "6d", "2h", "9c"))).toBe(
      true
    );
  });

  test("ignores non-contiguous numbers straight", () => {
    expect(hasStraight(cards("Ah", "2h", "3h", "Th", "5h", "6h", "7h"))).toBe(
      false
    );
  });

  test.each([
    ["ten", ["Ts", "Tc", "Jd", "Qh", "Ks", "Ad", "2c"]],
    ["jack", ["Ts", "Jd", "Jc", "Qh", "Ks", "Ad", "2c"]],
    ["queen", ["Ts", "Jd", "Qc", "Qh", "Ks", "Ad", "2c"]],
    ["king", ["Ts", "Jd", "Qh", "Kc", "Ks", "Ad", "2c"]],
    ["ace", ["Ts", "Jd", "Qh", "Ks", "Ad", "Ac", "2c"]],
  ])("detect an ace-high straight with a paired %s", (_, set) => {
    expect(hasStraight(cards(...set))).toBe(true);
  });

  test("detect a straight with a pair in-between", () => {
    expect(hasStraight(cards("5s", "6d", "7c", "7h", "8s", "9d", "2c"))).toBe(
      true
    );
  });
});
