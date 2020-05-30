import isValidSuit from "../../../src/model/card/isValidSuit";

describe("detecting valid suits", () => {
  test("valid suit", () => {
    expect(isValidSuit("C")).toBe(true);
  });
  test("invalid suit", () => {
    expect(isValidSuit("X")).toBe(false);
  });
});
