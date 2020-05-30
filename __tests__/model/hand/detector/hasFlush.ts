import hasFlush from "../../../../src/model/hand/detect/hasFlush";
import cards from "../../../../src/model/card/cards";

describe("detect flushes", () => {
  test("detect a flush", () => {
    expect(hasFlush(cards("D2", "D4", "DQ", "DJ", "DT"))).toBe(true);
  });

  test("detect a flush from seven cards", () => {
    expect(hasFlush(cards("D2", "D4", "DQ", "DJ", "DT", "H3", "H2"))).toBe(
      true
    );
  });

  test("detect a flush from seven cards of equal suit", () => {
    expect(hasFlush(cards("D2", "D4", "DQ", "DJ", "DT", "D3", "D5"))).toBe(
      true
    );
  });
});
