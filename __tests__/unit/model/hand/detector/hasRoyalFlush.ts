import hasRoyalFlush from "../../../../../src/model/hand/detect/hasRoyalFlush";
import cards from "../../../../../src/model/card/cards";

describe("detect royal flushes", () => {
  test("detect a royal flush", () => {
    expect(hasRoyalFlush(cards("Ad", "Kd", "Qd", "Jd", "Td"))).toBe(true);
  });

  test("a non-suited high straight is not a royal flush", () => {
    expect(hasRoyalFlush(cards("Ad", "Kd", "Qd", "Jd", "Th"))).toBe(false);
  });
});
