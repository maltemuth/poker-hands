import { Command } from "commander";
import { odds } from "@malte.muth/poker-hands";
import {
  parseHoleCards,
  parseBoardCards,
  parseConcatenatedCards,
} from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const oddsCommand = new Command()
  .name("odds")
  .description("Calculate winning odds for given hole cards and board")
  .argument("<hole1>", "First player hole cards (e.g., AhAs)")
  .argument("<hole2>", "Second player hole cards (e.g., KdKh)")
  .argument("[board...]", "Community board cards (optional)", [])
  .action((hole1: string, hole2: string, board: string[]) => {
    try {
      // Process hole1 to handle concatenated cards only (no spaces)
      const processedHole1: string[] = [];
      if (hole1.length > 2) {
        const concatenatedCards = parseConcatenatedCards(hole1);
        processedHole1.push(...concatenatedCards);
      } else {
        processedHole1.push(hole1);
      }

      // Process hole2 to handle concatenated cards only (no spaces)
      const processedHole2: string[] = [];
      if (hole2.length > 2) {
        const concatenatedCards = parseConcatenatedCards(hole2);
        processedHole2.push(...concatenatedCards);
      } else {
        processedHole2.push(hole2);
      }

      const hole1Cards = parseHoleCards(processedHole1.join(" "));
      const hole2Cards = parseHoleCards(processedHole2.join(" "));
      const boardCards = parseBoardCards(board);

      const oddsResult = odds([hole1Cards, hole2Cards], boardCards);

      console.log(outputFormatter.formatOdds(oddsResult));
    } catch (error) {
      console.error(
        "Error:",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      process.exit(1);
    }
  });
