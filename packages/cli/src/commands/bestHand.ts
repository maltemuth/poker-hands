import { Command } from "commander";
import { getBestHand } from "@malte.muth/poker-hands";
import { parseCardInputs, parseConcatenatedCards } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const bestHandCommand = new Command()
  .name("best-hand")
  .description("Get the best possible poker hand from a set of cards")
  .argument("<cards...>", 'Cards to evaluate (e.g., "2h Td As" or "2hTdAs")')
  .action((cardStrings: string[]) => {
    try {
      // Process each card string to handle both individual and concatenated cards
      const processedCardStrings: string[] = [];

      for (const cardString of cardStrings) {
        // If the string contains spaces, split it into individual cards
        if (cardString.includes(" ")) {
          const individualCards = cardString
            .split(" ")
            .filter((s) => s.trim() !== "");
          processedCardStrings.push(...individualCards);
        } else {
          // If no spaces, check if it's a concatenated card string
          if (cardString.length > 2) {
            // Parse concatenated cards like "AsAhKd"
            const concatenatedCards = parseConcatenatedCards(cardString);
            processedCardStrings.push(...concatenatedCards);
          } else {
            // Single card like "As"
            processedCardStrings.push(cardString);
          }
        }
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
