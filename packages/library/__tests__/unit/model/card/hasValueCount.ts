import hasValueCount from "../../../../src/model/card/hasValueCount";
import cards from "../../../../src/model/card/cards";

describe("can detect value counts", () => {
  test("detects a value count of two", () => {
    expect(hasValueCount(cards("Ac", "Ad"), 2)).toBe(true);
  });

  test("detects a value count of double two", () => {
    expect(hasValueCount(cards("Ac", "Ad", "Tc", "Td"), 2, 2)).toBe(true);
  });

  test("detects a value count of three", () => {
    expect(hasValueCount(cards("Ac", "Ad", "Ac", "Td"), 2)).toBe(true);
    expect(hasValueCount(cards("Ac", "Ad", "Ac", "Td"), 3)).toBe(true);
    expect(hasValueCount(cards("Ac", "Ad", "Ac", "Td"), 4)).toBe(false);
  });

  test("detects a value count of four", () => {
    expect(
      hasValueCount(cards("Ac", "Ad", "Ac", "Td", "Th", "Ts", "Ah"), 4)
    ).toBe(true);
  });

  test("does not detect too many matches", () => {
    expect(hasValueCount(cards("Ad", "As", "Ah"), 3)).toBe(true);
    expect(hasValueCount(cards("Ad", "As", "Ah"), 2, 2)).toBe(false);
  });
});
