// Compares the WebAssembly build with the TypeScript library on seeded random
// spots: every rank and count must be the same.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as ts from "@malte.muth/poker-hands";
import { odds, percentages, handRank } from "@malte.muth/poker-hands-wasm";

// mulberry32, so every run checks the same spots
const seededRandom = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const DECK = [..."23456789TJQKA"].flatMap((value) =>
  [..."hdcs"].map((suit) => value + suit)
);

/** `size` distinct random cards, as strings */
const draw = (random, size) => {
  const deck = [...DECK];
  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(random() * (deck.length - i));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, size);
};

const toCards = (strings) => ts.cards(...strings);

test("ranks 20,000 random 7-card hands like handRank", () => {
  const random = seededRandom(1);
  for (let i = 0; i < 20_000; i++) {
    const hand = draw(random, 7);
    assert.equal(
      handRank(hand.join("")),
      ts.handRank(ts.getBestHand(toCards(hand))),
      hand.join("")
    );
  }
});

test("counts the same wins and ties as odds() on random spots", () => {
  const random = seededRandom(2);
  // [board cards, number of spots]: pre-flop is slow, so only a few
  for (const [boardSize, spots] of [
    [0, 3],
    [3, 40],
    [4, 60],
    [5, 60],
  ]) {
    for (let spot = 0; spot < spots; spot++) {
      const players = 2 + Math.floor(random() * 5);
      const cards = draw(random, 2 * players + boardSize);
      const holes = Array.from({ length: players }, (_, i) =>
        cards.slice(2 * i, 2 * i + 2)
      );
      const board = cards.slice(2 * players);

      const expected = ts.odds(holes.map(toCards), toCards(board));
      const actual = odds(
        holes.map((hole) => hole.join("")),
        board.join(" ")
      );
      const label = `${holes.map((h) => h.join("")).join(" ")} | ${board.join("")}`;
      assert.deepEqual(
        actual.map(({ wins, ties, winChance, tieChance }) => ({
          wins,
          ties,
          winChance,
          tieChance,
        })),
        expected.map(({ wins, ties, winChance, tieChance }) => ({
          wins,
          ties,
          winChance,
          tieChance,
        })),
        label
      );
    }
  }
});

test("counts the same hand types as percentages() on random spots", () => {
  const random = seededRandom(3);
  for (let spot = 0; spot < 60; spot++) {
    const boardSize = [0, 3, 4, 5][spot % 4];
    const deadSize = Math.floor(random() * 5);
    const cards = draw(random, 2 + boardSize + deadSize);
    const [hole, board, dead] = [
      cards.slice(0, 2),
      cards.slice(2, 2 + boardSize),
      cards.slice(2 + boardSize),
    ];
    // pre-flop with dead cards only every fourth spot, to keep it quick
    if (boardSize === 0 && spot % 8 !== 0) continue;

    assert.deepEqual(
      percentages(hole.join(""), board.join(""), dead.join("")),
      ts.percentages(toCards(hole), toCards(board), toCards(dead)),
      `${hole.join("")} | ${board.join("")} | dead ${dead.join("")}`
    );
  }
});

test("rejects the input the Rust code rejects", () => {
  assert.throws(() => odds(["AhAs", "Kd"]), /Hole 2 must have 2 cards/);
  assert.throws(() => odds(["AhAs", "AhKc"]), /used more than once: Ah/);
  assert.throws(() => odds(["AhAs", "KdKc"], "2c3c4c5c6c7c"), /at most 5/);
  assert.throws(() => odds(["AhAs", "Xx"]), /Invalid card/);
  assert.throws(() => odds([]), /At least one hole/);
  assert.throws(() => percentages("Ah"), /must have 2 cards/);
  assert.throws(() => handRank("AhKhQhJhTh9h8h7h"), /At most 7/);
});
