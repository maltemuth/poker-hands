import express from "express";
import { OddsRequest } from "../types";
import {
  validateOddsInput,
  executeCliCommand,
  formatCliOutput,
  createApiResponse,
} from "../utils";

export function setupRoutes(app: express.Application): void {
  // Odds calculation endpoint
  app.post("/api/odds", (req, res) => {
    try {
      const input = req.body as OddsRequest;

      // Validate input
      const validationError = validateOddsInput(input);
      if (validationError) {
        const response = createApiResponse(validationError.error);
        return res.status(400).json(response);
      }

      // Build CLI command
      //
      // CLI Command Format Analysis:
      // - The poker-hands CLI expects hole cards as separate arguments for each player
      // - Each player's hole cards should be a single space-separated string
      // - Board cards are provided via the --board option as a single concatenated argument
      //   (separate arguments would be read as additional players)
      // - JSON output is enabled with --json flag
      //
      // Example: npx poker-hands odds "AhAs" "KdKh" "QcQd" --board "2h5d9c" --json
      //          ^         ^    ^    ^    ^    ^    ^    ^    ^    ^    ^    ^
      //          |         |    |    |    |    |    |    |    |    |    |    |
      //          program   cmd  p1   p2   p3   |    |    |    |    |    |    |
      //                                        |    |    |    |    |    |    |
      //                                        |    |    |    |    |    |    +-- JSON output
      //                                        |    |    |    |    |    +-------- Board cards
      //                                        |    |    |    |    +------------- Option separator
      //                                        |    |    |    +------------------ Board cards (concatenated)
      //                                        |    |    +----------------------- Player 3 hole cards (concatenated)
      //                                        |    +--------------------------- Player 2 hole cards (concatenated)
      //                                        +------------------------------ Player 1 hole cards (concatenated)
      //
      // Input Format:
      // - input.holes: string[][] - Array of player hole cards, e.g., [["Ah", "As"], ["Kd", "Kh"]]
      // - input.board: string[] | undefined - Community cards, e.g., ["2h", "5d", "9c"]
      //
      // Transformation Steps:
      // 1. Map each player's hole cards array to a concatenated string (e.g., ["Ah", "As"] -> "AhAs")
      // 2. Join all player arguments with spaces to create separate CLI arguments
      // 3. Add --board option if board cards exist
      // 4. Add --json flag for structured output
      const playerHoleArgs = input.holes.map((hole) => hole.join(""));
      const boardArgs = input.board || [];

      // Construct command with proper formatting:
      const cliCommand = `npx poker-hands odds ${playerHoleArgs.join(" ")}${
        boardArgs.length > 0 ? ` --board ${boardArgs.join("")}` : ""
      }${input.options?.mode ? ` --mode ${input.options.mode}` : ""}${
        input.options?.threshold !== undefined
          ? ` --threshold ${input.options.threshold}`
          : ""
      }${
        input.options?.sampleSize !== undefined
          ? ` --sample-size ${input.options.sampleSize}`
          : ""
      } --json`;

      // Execute CLI command asynchronously
      executeCliCommand(cliCommand)
        .then((cliOutput) => {
          const oddsResponse = formatCliOutput(cliOutput);
          const response = createApiResponse(oddsResponse);
          res.json(response);
        })
        .catch((error) => {
          const response = createApiResponse(error.message);
          res.status(500).json(response);
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const response = createApiResponse("Internal server error");
      res.status(500).json(response);
    }
  });

  // Percentages endpoint - returns "not implemented"
  app.post("/api/percentages", (req, res) => {
    const response = createApiResponse("Not implemented");
    res.status(501).json(response);
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    const response = createApiResponse({ status: "healthy" });
    res.json(response);
  });
}
