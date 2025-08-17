import { Command } from "commander";
import { percentages } from "@malte.muth/poker-hands";
import {
  parseHoleCards,
  parseBoardCards,
  parseConcatenatedCards,
} from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const percentagesCommand = new Command()
  .name("percentages")
  .description("Calculate hand type percentages for given hole cards and board")
  .argument("<hole1>", 'First player hole cards (e.g., "2h Td" or "2hTd")')
  .argument("<hole2>", 'Second player hole cards (e.g., "3c 4d" or "3c4d")')
  .argument("[board...]", "Community board cards (optional)", [])
  .action((hole1: string, hole2: string, board: string[]) => {
    try {
      // Process hole1 to handle both individual and concatenated cards
      const processedHole1: string[] = [];
      if (hole1.includes(" ")) {
        const individualCards = hole1.split(" ").filter((s) => s.trim() !== "");
        processedHole1.push(...individualCards);
      } else {
        if (hole1.length > 2) {
          const concatenatedCards = parseConcatenatedCards(hole1);
          processedHole1.push(...concatenatedCards);
        } else {
          processedHole1.push(hole1);
        }
      }

      const hole1Cards = parseHoleCards(processedHole1.join(" "));
      const boardCards = parseBoardCards(board);

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
