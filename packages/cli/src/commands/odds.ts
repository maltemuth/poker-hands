import { Command } from "commander";
import { odds, Card, HoleOdds, OddsOptions } from "@malte.muth/poker-hands";
import { parseCards } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

function parseHoleCardsForPlayers(holes: string[]): Card[][] {
  return holes.map((holeString) => parseCards(holeString));
}

function validateHoleCards(holeCardsList: Card[][]): void {
  if (holeCardsList.length < 1) {
    throw new Error("At least one set of hole cards is required");
  }
}

function buildOddsOptions(options: { progress?: boolean }): OddsOptions {
  return {
    progress: options.progress
      ? (progress: number) => {
          // Clear the dots and show progress
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          process.stdout.write(`\r${Math.round(progress * 100)}`);
        }
      : undefined,
  };
}

function handleProgressCleanup(progress?: boolean): void {
  if (progress) {
    process.stdout.write(`\r`);
  }
}

function handleError(error: unknown): void {
  console.error(
    "Error:",
    error instanceof Error ? error.message : "Unknown error occurred"
  );
  process.exit(1);
}

let progressInterval: ReturnType<typeof setInterval> | null = null;

function calculateOdds(
  holes: string[],
  options: {
    board?: string;
    progress?: boolean;
    json?: boolean;
  }
) {
  // Parse hole cards for all players
  const holeCardsList = parseHoleCardsForPlayers(holes);

  // Parse board cards if provided
  const boardCards = options.board ? parseCards(options.board) : [];

  // Validate inputs
  validateHoleCards(holeCardsList);

  const oddsOptions = buildOddsOptions({
    progress: options.progress && !options.json, // Don't show progress if JSON is requested
  });

  // Calculate odds
  return odds(holeCardsList, boardCards, oddsOptions);
}

function displayOddsResult(
  oddsResult: HoleOdds[],
  options: {
    progress?: boolean;
    json?: boolean;
  }
) {
  // Clean up progress display
  handleProgressCleanup(options.progress && !options.json);

  // Output results
  if (options.json) {
    console.log(
      JSON.stringify(
        outputFormatter.createJsonResponse(
          true,
          "odds",
          outputFormatter.formatOddsJson(oddsResult)
        )
      )
    );
  } else {
    console.log(outputFormatter.formatOdds(oddsResult));
  }
}

function handleOddsError(
  error: unknown,
  options: {
    json?: boolean;
  }
) {
  if (options.json) {
    console.log(
      JSON.stringify(
        outputFormatter.createJsonResponse(
          false,
          "odds",
          undefined,
          error instanceof Error ? error.message : "Unknown error occurred"
        )
      )
    );
  } else {
    handleError(error);
  }
}

export const createOddsCommand = () =>
  new Command()
    .name("odds")
    .description("Calculate winning odds for given hole cards and board")
    .argument("<holes...>", "Player hole cards (e.g., AhAs KdKh QcQd)")
    .option("--board <board>", "Community board cards (e.g., 2h5d9c)", "")
    .option("--progress", "Show progress during calculation")
    .option("--json", "Output results in JSON format")
    .action(
      (
        holes: string[],
        options: {
          board?: string;
          progress?: boolean;
          json?: boolean;
        }
      ) => {
        try {
          const oddsResult = calculateOdds(holes, options);
          displayOddsResult(oddsResult, options);
        } catch (error) {
          handleOddsError(error, options);
        }
      }
    );
