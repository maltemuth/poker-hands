import { OddsRequest, PercentagesRequest } from "../types";

type ValidationError = { error: string } | null;

const cardRegex = /^[2-9TJQKA][hdsc]$/;

/**
 * Validate the players' hole cards: at least `minPlayers` players with
 * exactly two cards each
 */
function validateHoles(holes: unknown, minPlayers: number): ValidationError {
  if (!holes || !Array.isArray(holes) || holes.length < minPlayers) {
    const players = minPlayers === 1 ? "player" : "players";
    return {
      error: `Holes must be provided as an array with at least ${minPlayers} ${players}`,
    };
  }

  // Validate each player's hole cards
  for (let i = 0; i < holes.length; i++) {
    if (!Array.isArray(holes[i]) || holes[i].length !== 2) {
      return { error: `Player ${i + 1} must have exactly 2 hole cards` };
    }

    // Validate card format
    for (const card of holes[i]) {
      if (typeof card !== "string" || !cardRegex.test(card)) {
        return { error: `Invalid card format: ${card}` };
      }
    }
  }

  return null;
}

/**
 * Validate the board cards, if provided: at most five valid cards
 */
function validateBoard(board: unknown): ValidationError {
  if (!board) {
    return null;
  }

  if (!Array.isArray(board)) {
    return { error: "Board must be provided as an array" };
  }

  if (board.length > 5) {
    return { error: "Maximum 5 board cards allowed" };
  }

  for (const card of board) {
    if (typeof card !== "string" || !cardRegex.test(card)) {
      return { error: `Invalid board card format: ${card}` };
    }
  }

  return null;
}

/**
 * Validate odds calculation input
 */
export function validateOddsInput(input: OddsRequest): ValidationError {
  const cardsError =
    validateHoles(input.holes, 2) ?? validateBoard(input.board);
  if (cardsError) {
    return cardsError;
  }

  // Validate options if provided
  if (input.options) {
    const validModes = ["auto", "exhaustive", "monteCarlo"];
    if (input.options.mode && !validModes.includes(input.options.mode)) {
      return {
        error: `Invalid mode: ${
          input.options.mode
        }. Must be one of: ${validModes.join(", ")}`,
      };
    }

    if (
      input.options.threshold !== undefined &&
      (typeof input.options.threshold !== "number" ||
        input.options.threshold <= 0)
    ) {
      return { error: "Threshold must be a positive number" };
    }

    if (
      input.options.sampleSize !== undefined &&
      (typeof input.options.sampleSize !== "number" ||
        input.options.sampleSize <= 0)
    ) {
      return { error: "Sample size must be a positive number" };
    }
  }

  return null;
}

/**
 * Validate hand type percentages input
 */
export function validatePercentagesInput(
  input: PercentagesRequest
): ValidationError {
  return validateHoles(input.holes, 1) ?? validateBoard(input.board);
}

/**
 * Create standardized API response
 */
export function createApiResponse<T>(dataOrError: T | string): T | string {
  return dataOrError;
}
