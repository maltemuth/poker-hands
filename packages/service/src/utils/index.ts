import express from "express";
import { ErrorResponse } from "../types/index.js";

/**
 * Sends an error response; its body is the spec's ErrorResponse
 */
export function sendError(
  res: express.Response,
  status: number,
  message: ErrorResponse
): void {
  res.status(status).json(message);
}
