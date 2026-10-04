import { Command } from "commander";
import { odds, Card, HoleOdds, OddsOptions } from "@malte.muth/poker-hands";
import { parseCards } from "../utils/cardParser.js";
import { outputFormatter } from "../utils/outputFormatter.js";

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

function calculateOdds(
  holes: string[],
  options: {
    board?: string;
    progress?: boolean;
  }
) {
  // Parse hole cards for all players
  const holeCardsList = parseHoleCardsForPlayers(holes);

  // Parse board cards if provided
  const boardCards = options.board ? parseCards(options.board) : [];

  // Validate inputs
  validateHoleCards(holeCardsList);

  const oddsOptions = buildOddsOptions({ progress: options.progress });

  // Calculate odds
  return odds(holeCardsList, boardCards, oddsOptions);
}

function displayOddsResult(
  oddsResult: HoleOdds[],
  options: {
    progress?: boolean;
  }
) {
  // Clean up progress display
  handleProgressCleanup(options.progress);

  console.log(outputFormatter.formatOdds(oddsResult));
}

export const createOddsCommand = () =>
  new Command()
    .name("odds")
    .description("Calculate winning odds for given hole cards and board")
    .argument("<holes...>", "Player hole cards (e.g., AhAs KdKh QcQd)")
    .option("--board <board>", "Community board cards (e.g., 2h5d9c)", "")
    .option("--progress", "Show progress during calculation")
    .action(
      (
        holes: string[],
        options: {
          board?: string;
          progress?: boolean;
        }
      ) => {
        try {
          const oddsResult = calculateOdds(holes, options);
          displayOddsResult(oddsResult, options);
        } catch (error) {
          handleError(error);
        }
      }
    );
