import create from "../../../../src/model/deck/create.js";
import shuffle from "../../../../src/model/deck/shuffle.js";
import toString from "../../../../src/model/card/toString.js";

describe("shuffle decks", () => {
  test("a deck has 52 cards", () => {
    expect(create().length).toBe(52);
  });

  test("a shuffled deck has 52 cards", () => {
    expect(shuffle(create()).length).toBe(52);
  });

  test("a shuffled deck has no repeated card", () => {
    const shuffledDeck = shuffle(create());
    const cardIds = shuffledDeck.map(toString);
    const uniqueCardIds = cardIds.filter(
      (id, index, list) => list.findIndex((_) => _ === id) === index
    );
    expect(uniqueCardIds.length).toBe(52);
  });

  test("every item ends up in every position equally often", () => {
    const shuffles = 20_000;
    // counts[item][position]
    const counts = [0, 1, 2, 3, 4].map(() => [0, 0, 0, 0, 0]);
    for (let i = 0; i < shuffles; i++) {
      shuffle([0, 1, 2, 3, 4]).forEach((item, position) => {
        counts[item][position]++;
      });
    }

    // expected 4,000 each, with a standard deviation of about 57
    counts.flat().forEach((count) => {
      expect(count).toBeGreaterThan(3500);
      expect(count).toBeLessThan(4500);
    });
  });
});
