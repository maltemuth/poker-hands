import { Card } from "../card/Card";
import { suitMasksOf } from "../hand/handState";
import createBoardTally, { Tally } from "./boardTally";
import { Hole, ProgressCallback } from "./HoleOdds";

/**
 * Counts which holes win or tie on randomly completed boards. Each sample
 * draws the missing board cards from the remaining cards, every card with
 * the same probability, and ranks the holes on the result.
 *
 * The draw is a partial Fisher-Yates shuffle of one index array that is
 * reused for all samples: only the positions of the missing cards are
 * shuffled, and no deck is copied.
 *
 * @param holes - The players' hole cards
 * @param board - The known board cards (0 to 5)
 * @param rest - The cards the board can be completed with
 * @param samples - The number of random boards
 * @param progressCallback - Called with the share of boards done, every 100
 *   boards and after the last one
 * @param random - Returns a number in [0, 1), Math.random by default
 * @returns The wins and ties of each hole, in the order of the holes, and the
 *   number of boards
 */
const tallyRandomBoards = (
  holes: Hole[],
  board: Card[],
  rest: Card[],
  samples: number,
  progressCallback?: ProgressCallback,
  random: () => number = Math.random
): Tally => {
  const missing = 5 - board.length;
  const { tallyBoard, result } = createBoardTally(
    holes,
    samples,
    progressCallback
  );

  const [boardH, boardD, boardC, boardS] = suitMasksOf(board);
  // what each card adds to each suit mask: its bit to its suit's, 0 to others
  const restMasks = rest.map((card) => suitMasksOf([card]));
  const restH = restMasks.map((masks) => masks[0]);
  const restD = restMasks.map((masks) => masks[1]);
  const restC = restMasks.map((masks) => masks[2]);
  const restS = restMasks.map((masks) => masks[3]);
  // indices into rest; the first `missing` positions are the drawn cards
  const order = rest.map((_, index) => index);

  for (let sample = 0; sample < samples; sample++) {
    let h = boardH;
    let d = boardD;
    let c = boardC;
    let s = boardS;

    // draw each missing card from the cards not drawn yet in this sample
    for (let i = 0; i < missing; i++) {
      const j = i + Math.floor(random() * (order.length - i));
      const drawn = order[j];
      order[j] = order[i];
      order[i] = drawn;
      h |= restH[drawn];
      d |= restD[drawn];
      c |= restC[drawn];
      s |= restS[drawn];
    }

    tallyBoard(h, d, c, s);
  }

  return result();
};

export default tallyRandomBoards;
