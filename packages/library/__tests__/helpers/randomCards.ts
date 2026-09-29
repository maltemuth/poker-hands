import create from "../../src/model/deck/create.js";
import { Card } from "../../src/model/card/Card.js";

/**
 * mulberry32: a small seeded generator, so every run uses the same cards
 */
const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const deck = create();

/**
 * `size` distinct cards from a full deck, drawn with `random`
 */
const randomCards = (random: () => number, size: number): Card[] => {
  const cards = [...deck];
  // partial Fisher-Yates: the first `size` cards are a random draw
  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(random() * (cards.length - i));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards.slice(0, size);
};

export { seededRandom, randomCards };
