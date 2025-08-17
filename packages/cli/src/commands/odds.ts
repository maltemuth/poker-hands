import { Command } from "commander";
import { odds } from "@malte.muth/poker-hands";
import { parseHoleCards, parseBoardCards } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const oddsCommand = new Command()
  .name("odds")
  .description("Calculate winning odds for given hole cards and board")
  .argument("<hole1>", "First player hole cards (e.g., AhAs)")
  .argument("<hole2>", "Second player hole cards (e.g., KdKh)")
  .argument("[board...]", "Community board cards (optional)", [])
  .option("--progress", "Show progress during calculation")
  .action(
    (
      hole1: string,
      hole2: string,
      board: string[],
      options: { progress?: boolean }
    ) => {
      let progressInterval: ReturnType<typeof setInterval> | null = null;

      try {
        const hole1Cards = parseHoleCards(hole1);
        const hole2Cards = parseHoleCards(hole2);
        const boardCards = parseBoardCards(board);

        if (options.progress) {
          progressInterval = setInterval(() => {
            process.stdout.write(".");
          }, 100);
        }

        const oddsResult = odds(
          [hole1Cards, hole2Cards],
          boardCards,
          10000, // sampleSize
          10000, // threshold
          options.progress
            ? (progress: any) => {
                // Clear the dots and show progress
                if (progressInterval) {
                  clearInterval(progressInterval);
                  progressInterval = null;
                }
                process.stdout.write(
                  `\r${progress.message} (${Math.round(
                    (progress.current / progress.total) * 100
                  )}%)\n`
                );
              }
            : undefined
        );

        if (progressInterval) {
          clearInterval(progressInterval);
        }

        console.log(outputFormatter.formatOdds(oddsResult));
      } catch (error) {
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        console.error(
          "Error:",
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        process.exit(1);
      }
    }
  );
