import express from "express";
import { OddsRequest, OddsResponse, ApiResponse } from "../types";
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
        const response: ApiResponse = createApiResponse(
          false,
          undefined,
          validationError.error
        );
        return res.status(400).json(response);
      }

      // Build CLI command
      const holeArgs = input.holes.flatMap((hole) => hole);
      const boardArgs = input.board || [];
      const cliCommand = `npx poker-hands odds ${holeArgs.join(
        " "
      )} ${boardArgs.join(" ")} --json`;

      // Execute CLI command asynchronously
      executeCliCommand(cliCommand)
        .then((cliOutput) => {
          const oddsResponse = formatCliOutput(cliOutput);
          const response: ApiResponse<OddsResponse> = createApiResponse(
            true,
            oddsResponse
          );
          res.json(response);
        })
        .catch((error) => {
          const response: ApiResponse = createApiResponse(
            false,
            undefined,
            error.message
          );
          res.status(500).json(response);
        });
    } catch (_error) {
      const response: ApiResponse = createApiResponse(
        false,
        undefined,
        "Internal server error"
      );
      res.status(500).json(response);
    }
  });

  // Percentages endpoint - returns "not implemented"
  app.post("/api/percentages", (req, res) => {
    const response: ApiResponse = createApiResponse(
      false,
      undefined,
      "Not implemented"
    );
    res.status(501).json(response);
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    const response: ApiResponse = createApiResponse(true, {
      status: "healthy",
    });
    res.json(response);
  });
}
