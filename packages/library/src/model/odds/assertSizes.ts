import { Card } from "../card/Card.js";

/**
 * Throws unless the hole has exactly two cards; `index` counts holes from 0
 */
export const assertHoleSize = (hole: Card[], index = 0): void => {
  if (hole.length !== 2) {
    throw new Error(
      `Hole ${index + 1} must have 2 cards, but has ${hole.length}`
    );
  }
};

/**
 * Throws if the board has more than five cards
 */
export const assertBoardSize = (board: Card[]): void => {
  if (board.length > 5) {
    throw new Error(
      `The board has ${board.length} cards, at most 5 are allowed`
    );
  }
};
