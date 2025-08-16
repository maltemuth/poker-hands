import create from "../../../../src/model/deck/create";
import shuffle from "../../../../src/model/deck/shuffle";
import toString from "../../../../src/model/card/toString";

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
});
