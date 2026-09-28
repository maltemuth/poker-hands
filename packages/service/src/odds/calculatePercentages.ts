import { percentages, cards } from "@malte.muth/poker-hands";
import {
  PercentagesRequest,
  PercentagesResponse,
  PercentagesData,
} from "../types";

/**
 * Calculates the hand type percentages of every player in a validated
 * request. Each player's calculation treats the other players' hole cards
 * as dead, since they can't appear on the board.
 *
 * @param request - The percentages request, with cards as strings (e.g. "Ah")
 * @returns The percentages of each player, in the order of the request's holes
 * @throws {Error} If the library rejects the cards, e.g. because of duplicates
 */
const calculatePercentages = (
  request: PercentagesRequest
): PercentagesResponse => {
  const board = cards(...(request.board ?? []));

  return {
    players: request.holes.map((hole, index) => {
      const dead = request.holes
        .filter((_, other) => other !== index)
        .flatMap((otherHole) => cards(...otherHole));

      return {
        holeCards: hole,
        // typed as a record by the library, but always the ten hand types
        percentages: percentages(
          cards(...hole),
          board,
          dead
        ) as unknown as PercentagesData,
      };
    }),
  };
};

export default calculatePercentages;
