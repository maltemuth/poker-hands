import { Command } from "commander";
import { odds, Card } from "@malte.muth/poker-hands";
import { parseHoleCards, parseBoardCards } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const oddsCommand = new Command()
  .name("odds")
  .description("Calculate winning odds for given hole cards and board")
  .argument("<holes...>", "Player hole cards (e.g., AhAs KdKh QcQd)")
  .option("--board", "Community board cards (e.g., 2h 5d 9c)", "")
  .option("--mode", "Calculation mode (auto, exhaustive, monte-carlo)", "auto")
  .option("--threshold", "Threshold for auto mode (default: 10000)", parseInt)
  .option(
    "--sample-size",
    "Sample size for monte-carlo mode (default: 10000)",
    parseInt
  )
  .option("--progress", "Show progress during calculation")
  .action(
    (
      holes: string[],
      options: {
        board?: string;
        mode?: string;
        threshold?: number;
        sampleSize?: number;
        progress?: boolean;
      }
    ) => {
      let progressInterval: ReturnType<typeof setInterval> | null = null;

      try {
        // Parse hole cards for all players
        const holeCardsList: Card[][] = [];
        for (const holeInput of holes) {
          const holeCards = parseHoleCards(holeInput);
          holeCardsList.push(holeCards);
        }

        // Parse board cards if provided
        const boardCards = options.board ? parseBoardCards(options.board) : [];

        // Validate at least one hole card set
        if (holeCardsList.length < 1) {
          throw new Error("At least one set of hole cards is required");
        }

        // Validate mode option
        const validModes = ["auto", "exhaustive", "monte-carlo"];
        const mode =
          options.mode && validModes.includes(options.mode)
            ? (options.mode as "auto" | "exhaustive" | "monte-carlo")
            : "auto";

        // Build options object with mode-specific parameters
        const oddsOptions: any = {
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
        if (mode === "auto" && options.threshold !== undefined) {
          oddsOptions.threshold = options.threshold;
        }

        // Add sampleSize only for monte-carlo mode
        if (mode === "monte-carlo" && options.sampleSize !== undefined) {
          oddsOptions.sampleSize = options.sampleSize;
        }

        const oddsResult = odds(holeCardsList, boardCards, oddsOptions);

        if (options.progress) {
          process.stdout.write(`\r`);
        }

        console.log(outputFormatter.formatOdds(oddsResult));
      } catch (error) {
        console.error(
          "Error:",
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        process.exit(1);
      }
    }
  );
