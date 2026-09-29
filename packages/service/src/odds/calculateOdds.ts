import { odds, cards, toString } from "@malte.muth/poker-hands";
import { OddsRequest, OddsData } from "../types/index.js";

/**
 * Calculates the odds for a validated odds request with the poker library.
 *
 * @param request - The odds request, with cards as strings (e.g. "Ah")
 * @returns The odds of each player, in the order of the request's holes
 * @throws {Error} If the library rejects the cards, e.g. because of duplicates
 */
const calculateOdds = (request: OddsRequest): OddsData => {
  const holes = request.holes.map((hole) => cards(...hole));
  const board = cards(...(request.board ?? []));

  const result = odds(holes, board);

  return {
    players: result.map((player) => ({
      holeCards: player.hole.map(toString),
      winChance: player.winChance,
      tieChance: player.tieChance,
    })),
  };
};

export default calculateOdds;
