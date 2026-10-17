import assert from "node:assert/strict";
import { describe, it } from "node:test";
import create from "../../../../src/model/deck/create.js";
import shuffle from "../../../../src/model/deck/shuffle.js";
import toString from "../../../../src/model/card/toString.js";

describe("shuffle decks", () => {
  it("a deck has 52 cards", () => {
    assert.equal(create().length, 52);
  });

  it("a shuffled deck has 52 cards", () => {
    assert.equal(shuffle(create()).length, 52);
  });

  it("a shuffled deck has no repeated card", () => {
    const shuffledDeck = shuffle(create());
    const cardIds = shuffledDeck.map(toString);
    const uniqueCardIds = cardIds.filter(
      (id, index, list) => list.findIndex((_) => _ === id) === index
    );
    assert.equal(uniqueCardIds.length, 52);
  });

  it("every item ends up in every position equally often", () => {
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
      assert.ok(count > 3500);
      assert.ok(count < 4500);
    });
  });

  it("a deck has hearts, diamonds, clubs and spades from 2 to ace", () => {
    const deck = create().map(toString);

    assert.equal(
      deck.slice(0, 13).join(" "),
      "2h 3h 4h 5h 6h 7h 8h 9h Th Jh Qh Kh Ah"
    );
    assert.deepEqual(
      [deck[13], deck[26], deck[39], deck[51]],
      ["2d", "2c", "2s", "As"]
    );
  });

  it("shuffling leaves its input unchanged", () => {
    const items = [0, 1, 2, 3, 4];
    shuffle(items);

    assert.deepEqual(items, [0, 1, 2, 3, 4]);
  });
});
