import { Command } from "commander";
import { getBestHand } from "@malte.muth/poker-hands";
import { parseCards } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const bestHandCommand = new Command()
  .name("best-hand")
  .description("Get the best possible poker hand from a set of cards")
  .argument("<cards>", 'Cards to evaluate (e.g., "2hTdAs")')
  .option("--json", "Output results in JSON format")
  .action((cards: string, options: { json?: boolean }) => {
    try {
      const parsedCards = parseCards(cards);
      const bestHand = getBestHand(parsedCards);

      if (bestHand) {
        if (options.json) {
          console.log(
            JSON.stringify(
              outputFormatter.createJsonResponse(
                true,
                "best-hand",
                outputFormatter.formatBestHandJson(bestHand, parsedCards)
              )
            )
          );
        } else {
          console.log(outputFormatter.formatBestHand(bestHand, parsedCards));
        }
      } else {
        if (options.json) {
          console.log(
            JSON.stringify(
              outputFormatter.createJsonResponse(
                false,
                "best-hand",
                undefined,
                "No valid hand could be determined from the provided cards."
              )
            )
          );
        } else {
          console.log(
            "No valid hand could be determined from the provided cards."
          );
        }
      }
    } catch (error) {
      if (options.json) {
        console.log(
          JSON.stringify(
            outputFormatter.createJsonResponse(
              false,
              "best-hand",
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
  });
