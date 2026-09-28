import express from "express";
import { OddsRequest, PercentagesRequest } from "../types";
import { createApiResponse } from "../utils";
import { validateBody } from "../validation/requestValidator";
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
  app.post("/api/odds", validateBody("/api/odds"), (req, res) => {
    // Calculate in a worker thread
    respondWithCalculation(res, runInWorker("odds", req.body as OddsRequest));
  });

  // Hand type percentages endpoint
  app.post("/api/percentages", validateBody("/api/percentages"), (req, res) => {
    // Calculate in a worker thread
    respondWithCalculation(
      res,
      runInWorker("percentages", req.body as PercentagesRequest)
    );
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    const response = createApiResponse({ status: "healthy" });
    res.json(response);
  });
}
