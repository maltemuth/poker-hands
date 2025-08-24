import { exec } from "child_process";
import { OddsRequest, OddsResponse, CliOddsResponse } from "../types";
import Ajv from "ajv";
import oddsSchema from "../../../cli/schemas/odds.json";

/**
 * Execute CLI command asynchronously
 */
export function executeCliCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout);
      }
    });
  });
}

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

  return null;
}

/**
 * Validate CLI output against JSON schema
 */
export function validateCliOutput(cliOutput: string): {
  isValid: boolean;
  error?: string;
} {
  try {
    const parsedOutput = JSON.parse(cliOutput);
    const ajv = new Ajv();
    const validate = ajv.compile(oddsSchema);
    const isValid = validate(parsedOutput);

    if (!isValid) {
      return {
        isValid: false,
        error: `Schema validation failed: ${validate.errors
          ?.map((e) => e.message)
          .join(", ")}`,
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid JSON: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

/**
 * Format CLI output to OddsResponse
 */
export function formatCliOutput(cliOutput: string): OddsResponse {
  // Parse the CLI output and convert to OddsResponse format
  // This will depend on the actual CLI output format
  const parsedOutput = JSON.parse(cliOutput);

  // Validate against schema
  const validation = validateCliOutput(cliOutput);
  if (!validation.isValid) {
    throw new Error(`Invalid CLI output: ${validation.error}`);
  }

  return {
    winProbabilities:
      parsedOutput.data?.players?.map(
        (player: { winChance: number }) => player.winChance
      ) || [],
    handTypeProbabilities:
      parsedOutput.data?.players?.map(() =>
        // This is a placeholder - the CLI doesn't currently provide hand type probabilities
        ({
          highCard: 0,
          pair: 0,
          twoPair: 0,
          threeOfAKind: 0,
          straight: 0,
          flush: 0,
          fullHouse: 0,
          fourOfAKind: 0,
          straightFlush: 0,
          royalFlush: 0,
        })
      ) || [],
  };
}

/**
 * Parse CLI output as CliOddsResponse (raw format)
 */
export function parseCliOutput(cliOutput: string): CliOddsResponse {
  const parsedOutput = JSON.parse(cliOutput);

  // Validate against schema
  const validation = validateCliOutput(cliOutput);
  if (!validation.isValid) {
    throw new Error(`Invalid CLI output: ${validation.error}`);
  }

  return parsedOutput as CliOddsResponse;
}

/**
 * Create standardized API response
 */
export function createApiResponse<T>(dataOrError: T | string): T | string {
  return dataOrError;
}
