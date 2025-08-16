import { Command } from "commander";
import { odds } from "@malte.muth/poker-hands";
import { parseHoleCards, parseBoardCards } from "../utils/cardParser";
import { outputFormatter } from "../utils/outputFormatter";

export const oddsCommand = new Command()
  .name("odds")
  .description("Calculate winning odds for given hole cards and board")
  .argument("<hole1>", 'First player hole cards (e.g., "2h Td")')
  .argument("<hole2>", 'Second player hole cards (e.g., "3c 4d")')
  .argument("[board...]", "Community board cards (optional)", [])
  .action((hole1: string, hole2: string, board: string[]) => {
    try {
      const hole1Cards = parseHoleCards(hole1);
      const hole2Cards = parseHoleCards(hole2);
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
