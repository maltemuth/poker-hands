import { Command } from "commander";
import { getBestHand } from "@malte.muth/poker-hands";
import { parseCardInputs, parseConcatenatedCards } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const bestHandCommand = new Command()
  .name("best-hand")
  .description("Get the best possible poker hand from a set of cards")
  .argument("<cards...>", 'Cards to evaluate (e.g., "2hTdAs")')
  .action((cardStrings: string[]) => {
    try {
      // Process each card string to handle concatenated cards only
      const processedCardStrings: string[] = [];

      for (const cardString of cardStrings) {
        // Parse concatenated cards like "AsAhKd"
        const concatenatedCards = parseConcatenatedCards(cardString);
        processedCardStrings.push(...concatenatedCards);
      }

      const parsedCards = parseCardInputs(processedCardStrings);
      const bestHand = getBestHand(parsedCards);

      if (bestHand) {
        console.log(outputFormatter.formatBestHand(bestHand, parsedCards));
      } else {
        console.log(
          "No valid hand could be determined from the provided cards."
        );
      }
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      process.exit(1);
    }
  });
