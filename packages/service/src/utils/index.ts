import { OddsRequest } from "../types";

/**
 * Validate odds calculation input
 */
export function validateOddsInput(
  input: OddsRequest
): { error: string } | null {
  if (!input.holes || !Array.isArray(input.holes) || input.holes.length < 2) {
    return {
      error: "Holes must be provided as an array with at least 2 players",
    };
  }

  // Validate each player's hole cards
  for (let i = 0; i < input.holes.length; i++) {
    if (!Array.isArray(input.holes[i]) || input.holes[i].length !== 2) {
      return { error: `Player ${i + 1} must have exactly 2 hole cards` };
    }

    // Validate card format
    const cardRegex = /^[2-9TJQKA][hdsc]$/;
    for (const card of input.holes[i]) {
      if (typeof card !== "string" || !cardRegex.test(card)) {
        return { error: `Invalid card format: ${card}` };
      }
    }
  }

  // Validate board cards if provided
  if (input.board) {
    if (!Array.isArray(input.board)) {
      return { error: "Board must be provided as an array" };
    }

    if (input.board.length > 5) {
      return { error: "Maximum 5 board cards allowed" };
    }

    const cardRegex = /^[2-9TJQKA][hdsc]$/;
    for (const card of input.board) {
      if (typeof card !== "string" || !cardRegex.test(card)) {
        return { error: `Invalid board card format: ${card}` };
      }
    }
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
 * Create standardized API response
 */
export function createApiResponse<T>(dataOrError: T | string): T | string {
  return dataOrError;
}
