import { Command } from "commander";
import { odds, Card } from "@malte.muth/poker-hands";
import { parseCards } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";
import { OddsOptions } from "packages/library/dist/src/model/odds/odds";

function parseHoleCardsForPlayers(holes: string[]): Card[][] {
  return holes.map((holeString) => parseCards(holeString));
}

function validateHoleCards(holeCardsList: Card[][]): void {
  if (holeCardsList.length < 1) {
    throw new Error("At least one set of hole cards is required");
  }
}

function validateAndNormalizeMode(
  mode?: string
): "auto" | "exhaustive" | "monteCarlo" {
  const validModes = ["auto", "exhaustive", "monteCarlo"];
  return mode && validModes.includes(mode)
    ? (mode as "auto" | "exhaustive" | "monteCarlo")
    : "auto";
}

function buildOddsOptions(
  mode: "auto" | "exhaustive" | "monteCarlo",
  options: {
    threshold?: number;
    sampleSize?: number;
    progress?: boolean;
  }
): OddsOptions {
  const oddsOptions: OddsOptions = {
    mode,
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

  // Add threshold only for auto mode
  if (oddsOptions.mode === "auto" && options.threshold !== undefined) {
    oddsOptions.threshold = options.threshold;
  }

  // Add sampleSize only for monte-carlo mode
  if (oddsOptions.mode === "monteCarlo" && options.sampleSize !== undefined) {
    oddsOptions.sampleSize = options.sampleSize;
  }

  return oddsOptions;
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

export const oddsCommand = new Command()
  .name("odds")
  .description("Calculate winning odds for given hole cards and board")
  .argument("<holes...>", "Player hole cards (e.g., AhAs KdKh QcQd)")
  .option("--board <board>", "Community board cards (e.g., 2h5d9c)", "")
  .option(
    "-m, --mode <mode>",
    "Calculation mode (auto, exhaustive, monteCarlo)",
    "auto"
  )
  .option(
    "-t, --threshold <threshold>",
    "Threshold for auto mode (default: 10000)",
    parseInt
  )
  .option(
    "-s, --sample-size <sampleSize>",
    "Sample size for monte-carlo mode (default: 10000)",
    parseInt
  )
  .option("--progress", "Show progress during calculation")
  .option("--json", "Output results in JSON format")
  .action(
    (
      holes: string[],
      options: {
        board?: string;
        mode?: string;
        threshold?: number;
        sampleSize?: number;
        progress?: boolean;
        json?: boolean;
      }
    ) => {
      try {
        // Parse hole cards for all players
        const holeCardsList = parseHoleCardsForPlayers(holes);

        // Parse board cards if provided
        const boardCards = options.board ? parseCards(options.board) : [];

        // Validate inputs
        validateHoleCards(holeCardsList);

        // Validate and normalize mode
        const mode = validateAndNormalizeMode(options.mode);

        // Build options object with mode-specific parameters
        const oddsOptions = buildOddsOptions(mode, {
          threshold: options.threshold,
          sampleSize: options.sampleSize,
          progress: options.progress && !options.json, // Don't show progress if JSON is requested
        });

        // Calculate odds
        const oddsResult = odds(holeCardsList, boardCards, oddsOptions);

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
      } catch (error) {
        if (options.json) {
          console.log(
            JSON.stringify(
              outputFormatter.createJsonResponse(
                false,
                "odds",
                undefined,
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred"
              )
            )
          );
        } else {
          handleError(error);
        }
      }
    }
  );
