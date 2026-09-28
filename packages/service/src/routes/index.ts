import express from "express";
import { OddsRequest } from "../types";
import { validateOddsInput, createApiResponse } from "../utils";
import { holdSlotUntil } from "../middleware/rateLimiter";
import { runInWorker, CalculationError } from "../odds/runInWorker";

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

      // Calculate in a worker thread; the calculation keeps its concurrency
      // slot until it finishes, even if the client disconnects
      const calculation = runInWorker(input);
      holdSlotUntil(res, calculation);
      calculation
        .then((odds) => {
          const response = createApiResponse(odds);
          res.json(response);
        })
        .catch((error: Error) => {
          // the library rejected the cards (e.g. duplicates): a client error
          const status = error instanceof CalculationError ? 400 : 500;
          const response = createApiResponse(error.message);
          res.status(status).json(response);
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
