import { Command } from "commander";
import { percentages } from "@malte.muth/poker-hands";
import { outputFormatter } from "../utils/outputFormatter.js";
import { parseCards } from "../utils/index.js";

function calculatePercentages(
  hole: string,
  board: string[],
  options: { json?: boolean }
) {
  try {
    const hole1Cards = parseCards(hole);
    const boardCards = parseCards(board.join(" "));

    const percentagesResult = percentages(hole1Cards, boardCards);

    if (options.json) {
      console.log(
        JSON.stringify(
          outputFormatter.createJsonResponse(
            true,
            "percentages",
            outputFormatter.formatPercentagesJson(percentagesResult)
          )
        )
      );
    } else {
      console.log(outputFormatter.formatPercentages(percentagesResult));
    }
  } catch (error) {
    if (options.json) {
      console.log(
        JSON.stringify(
          outputFormatter.createJsonResponse(
            false,
            "percentages",
            undefined,
            error instanceof Error ? error.message : "Unknown error occurred"
          )
        )
      );
    } else {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      process.exit(1);
    }
  }
}

export const createPercentagesCommand = () =>
  new Command()
    .name("percentages")
    .description(
      "Calculate hand type percentages for given hole cards and board"
    )
    .argument("<hole>", 'Hole cards (e.g., "2hTd")')
    .argument("[board...]", "Community board cards (optional)", [])
    .option("--json", "Output results in JSON format")
    .action(calculatePercentages);
