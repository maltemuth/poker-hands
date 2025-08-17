import { Command } from "commander";
import { percentages } from "@malte.muth/poker-hands";
import { outputFormatter } from "../utils/outputFormatter";
import { parseCards } from "../utils";

export const percentagesCommand = new Command()
  .name("percentages")
  .description("Calculate hand type percentages for given hole cards and board")
  .argument("<hole>", 'Hole cards (e.g., "2hTd")')
  .argument("[board...]", "Community board cards (optional)", [])
  .action((hole: string, board: string) => {
    try {
      const hole1Cards = parseCards(hole);
      const boardCards = parseCards(board);

      const percentagesResult = percentages(hole1Cards, boardCards);

      console.log(outputFormatter.formatPercentages(percentagesResult));
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      process.exit(1);
    }
  });
