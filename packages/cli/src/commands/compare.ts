import { Command } from "commander";
import { getBestHand, isBetterThan } from "@malte.muth/poker-hands";
import { parseCardInputs, parseConcatenatedCards } from "../utils/cardParser";

export const compareCommand = new Command()
  .name("compare")
  .description("Compare two poker hands to determine which is better")
  .argument("<hand1>", 'First hand (e.g., "2h Td As" or "2hTdAs")')
  .argument("<hand2>", 'Second hand (e.g., "3c 4d 5s" or "3c4d5s")')
  .action((hand1: string, hand2: string) => {
    try {
      // Process hand1 to handle both individual and concatenated cards
      const processedHand1 = processHandInput(hand1);

      // Process hand2 to handle both individual and concatenated cards
      const processedHand2 = processHandInput(hand2);

      const hand1Cards = parseCardInputs(processedHand1);
      const hand2Cards = parseCardInputs(processedHand2);

      const bestHand1 = getBestHand(hand1Cards);
      const bestHand2 = getBestHand(hand2Cards);

      if (!bestHand1 || !bestHand2) {
        console.error(
          "Error: Could not determine best hand for one or both hands"
        );
        process.exit(1);
      }

      const result = isBetterThan(bestHand1, bestHand2);

      console.log(
        `Hand 1: ${hand1Cards
          .map((card) => `${card.value}${card.suit}`)
          .join(", ")}`
      );
      console.log(
        `Hand 2: ${hand2Cards
          .map((card) => `${card.value}${card.suit}`)
          .join(", ")}`
      );
      console.log(
        `Result: Hand 1 is ${result ? "better" : "worse"} than Hand 2`
      );
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      process.exit(1);
    }
  });

/**
 * Process a hand input string to handle both individual and concatenated cards
 * @param hand The hand input string
 * @returns Array of processed card strings
 */
function processHandInput(hand: string): string[] {
  if (hand.includes(" ")) {
    return hand.split(" ").filter((s) => s.trim() !== "");
  } else {
    if (hand.length > 2) {
      return parseConcatenatedCards(hand);
    } else {
      return [hand];
    }
  }
}
