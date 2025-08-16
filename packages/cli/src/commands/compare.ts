import { Command } from "commander";
import { cards, isBetterThan } from "@malte.muth/poker-hands";

export const compareCommand = new Command()
  .name("compare")
  .description("Compare two poker hands to determine which is better")
  .argument("<hand1>", 'First hand (e.g., "2h Td As")')
  .argument("<hand2>", 'Second hand (e.g., "3c 4d 5s")')
  .action((hand1: string, hand2: string) => {
    try {
      const hand1Cards = cards(...hand1.split(" "));
      const hand2Cards = cards(...hand2.split(" "));

      const result = isBetterThan(hand1Cards as any, hand2Cards as any);

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
