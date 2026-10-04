// The public API, shared by node.js and browser.js. The WebAssembly module
// returns flat arrays of counts; this turns them into objects.
import {
  oddsCounts,
  percentageCounts,
  handRank as rankCards,
} from "./pkg/poker_hands.js";

const HAND_TYPES = [
  "highCard",
  "pair",
  "twoPair",
  "threeOfAKind",
  "straight",
  "flush",
  "fullHouse",
  "fourOfAKind",
  "straightFlush",
  "royalFlush",
];

/**
 * The exact odds of each hole, over every way to complete the board.
 * Cards are strings like "AhKd"; whitespace between cards is allowed.
 */
export function odds(holes, board = "") {
  const counts = oddsCounts(holes, board);
  const players = holes.length;
  const boards = counts[2 * players];
  return holes.map((hole, index) => {
    const wins = counts[index];
    const ties = counts[players + index];
    return {
      hole,
      wins,
      ties,
      winChance: wins / boards,
      tieChance: ties / boards,
    };
  });
}

/**
 * How often the hole makes each hand type, over every way to complete the
 * board; dead cards can't appear on it.
 */
export function percentages(hole, board = "", dead = "") {
  const counts = percentageCounts(hole, board, dead);
  const boards = counts[HAND_TYPES.length];
  return Object.fromEntries(
    HAND_TYPES.map((type, index) => [
      type,
      { count: counts[index], percentage: counts[index] / boards },
    ])
  );
}

/**
 * The rank of the best five-card hand among up to seven cards: a better hand
 * has a higher rank, equally strong hands the same one.
 */
export function handRank(cards) {
  return rankCards(cards);
}
