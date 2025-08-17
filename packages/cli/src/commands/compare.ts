import { Command } from "commander";
import { getBestHand, isBetterThan } from "@malte.muth/poker-hands";
import { parseCards } from "../utils/cardParser";

export const compareCommand = new Command()
  .name("compare")
  .description("Compare two poker hands to determine which is better")
  .argument("<hand1>", 'First hand (e.g., "2hTdAs")')
  .argument("<hand2>", 'Second hand (e.g., "3c4d5s")')
  .action((hand1: string, hand2: string) => {
    try {
      const hand1Cards = parseCards(hand1);
      const hand2Cards = parseCards(hand2);

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
          .map(
            (card: { value: number; suit: string }) =>
              `${card.value}${card.suit}`
          )
          .join(", ")}`
      );
      console.log(
        `Hand 2: ${hand2Cards
          .map(
            (card: { value: number; suit: string }) =>
              `${card.value}${card.suit}`
          )
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
