import express from "express";
import { ErrorResponse } from "../types";

/**
 * Create standardized API response
 */
export function createApiResponse<T>(dataOrError: T | string): T | string {
  return dataOrError;
}

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
