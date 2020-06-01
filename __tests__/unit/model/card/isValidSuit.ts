import isValidSuit from "../../../../src/model/card/isValidSuit";

describe("detecting valid suits", () => {
  test("valid suit", () => {
    expect(isValidSuit("c")).toBe(true);
  });
  test("invalid suit", () => {
    expect(isValidSuit("x")).toBe(false);
  });
});
