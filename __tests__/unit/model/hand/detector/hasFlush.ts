import hasFlush from "../../../../../src/model/hand/detect/hasFlush";
import cards from "../../../../../src/model/card/cards";

describe("detect flushes", () => {
  test("detect a flush", () => {
    expect(hasFlush(cards("2d", "4d", "Qd", "Jd", "Td"))).toBe(true);
  });

  test("detect a flush from seven cards", () => {
    expect(hasFlush(cards("2d", "4d", "Qd", "Jd", "Td", "3h", "2h"))).toBe(
      true
    );
  });

  test("detect a flush from seven cards of equal suit", () => {
    expect(hasFlush(cards("2d", "4d", "Qd", "Jd", "Td", "3d", "5d"))).toBe(
      true
    );
  });
});
