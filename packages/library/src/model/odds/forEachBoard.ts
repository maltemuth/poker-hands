import { Card } from "../card/Card";
import { SuitMasks, suitMasksOf } from "../hand/rankOf";

/**
 * Completes the board in every possible way: for each combination of
 * `missing` cards from `rest`, calls `visit` with the suit masks of the known
 * cards plus that combination. No boards are built: the masks are passed down
 * as numbers while the cards are chosen one by one, so a card shared by many
 * boards is added only once.
 *
 * @param known - The suit masks of the known cards
 * @param rest - The cards the board can be completed with
 * @param missing - How many cards the board is missing
 * @param visit - Called once for each complete board, with its suit masks
 */
const forEachBoard = (
  known: SuitMasks,
  rest: Card[],
  missing: number,
  visit: (h: number, d: number, c: number, s: number) => void
): void => {
  // what each card adds to each suit mask: its bit to its suit's, 0 to others
  const restMasks = rest.map((card) => suitMasksOf([card]));
  const restH = restMasks.map((masks) => masks[0]);
  const restD = restMasks.map((masks) => masks[1]);
  const restC = restMasks.map((masks) => masks[2]);
  const restS = restMasks.map((masks) => masks[3]);

  // adds the missing cards in every combination, from rest[start] on
  const completeBoard = (
    start: number,
    missingCards: number,
    h: number,
    d: number,
    c: number,
    s: number
  ) => {
    if (missingCards === 0) {
      visit(h, d, c, s);
      return;
    }
    for (let i = start; i <= rest.length - missingCards; i++) {
      completeBoard(
        i + 1,
        missingCards - 1,
        h | restH[i],
        d | restD[i],
        c | restC[i],
        s | restS[i]
      );
    }
  };

  completeBoard(0, missing, known[0], known[1], known[2], known[3]);
};

export default forEachBoard;
