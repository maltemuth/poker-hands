import { Command } from "commander";
import { getBestHand } from "@malte.muth/poker-hands";
import { parseCardInputs } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const bestHandCommand = new Command()
  .name("best-hand")
  .description("Get the best possible poker hand from a set of cards")
  .argument("<cards...>", 'Cards to evaluate (e.g., "2h" "Td" "As")')
  .action((cardStrings: string[]) => {
    try {
      const parsedCards = parseCardInputs(cardStrings);
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
