import { odds, cards, toString, OddsOptions } from "@malte.muth/poker-hands";
import { OddsRequest, OddsData } from "../types";

/**
 * Maps the request options to the library's options; the threshold only
 * applies to auto mode and the sample size only to Monte Carlo mode.
 */
const toOddsOptions = (options: OddsRequest["options"] = {}): OddsOptions => {
  switch (options.mode) {
    case "exhaustive":
      return { mode: "exhaustive" };
    case "monteCarlo":
      return { mode: "monteCarlo", sampleSize: options.sampleSize };
    default:
      return { mode: "auto", threshold: options.threshold };
  }
};

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

  const result = odds(holes, board, toOddsOptions(request.options));

  return {
    players: result.map((player) => ({
      holeCards: player.hole.map(toString),
      winChance: player.winChance,
      tieChance: player.tieChance,
      ...(player.winChanceError !== undefined && {
        winChanceError: player.winChanceError,
      }),
    })),
  };
};

export default calculateOdds;
