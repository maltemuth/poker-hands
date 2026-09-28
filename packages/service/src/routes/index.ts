import express from "express";
import { OddsRequest, PercentagesRequest } from "../types";
import {
  validateOddsInput,
  validatePercentagesInput,
  createApiResponse,
} from "../utils";
import { holdSlotUntil } from "../middleware/rateLimiter";
import { runInWorker, CalculationError } from "../odds/runInWorker";

/**
 * Responds with the result of a calculation. The calculation keeps its
 * concurrency slot until it finishes, even if the client disconnects.
 */
function respondWithCalculation(
  res: express.Response,
  calculation: Promise<unknown>
): void {
  holdSlotUntil(res, calculation);
  calculation
    .then((result) => {
      const response = createApiResponse(result);
      res.json(response);
    })
    .catch((error: Error) => {
      // the library rejected the cards (e.g. duplicates): a client error
      const status = error instanceof CalculationError ? 400 : 500;
      const response = createApiResponse(error.message);
      res.status(status).json(response);
    });
}

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

      // Calculate in a worker thread
      respondWithCalculation(res, runInWorker("odds", input));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const response = createApiResponse("Internal server error");
      res.status(500).json(response);
    }
  });

  // Hand type percentages endpoint
  app.post("/api/percentages", (req, res) => {
    try {
      const input = req.body as PercentagesRequest;

      // Validate input
      const validationError = validatePercentagesInput(input);
      if (validationError) {
        const response = createApiResponse(validationError.error);
        return res.status(400).json(response);
      }

      // Calculate in a worker thread
      respondWithCalculation(res, runInWorker("percentages", input));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const response = createApiResponse("Internal server error");
      res.status(500).json(response);
    }
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    const response = createApiResponse({ status: "healthy" });
    res.json(response);
  });
}
