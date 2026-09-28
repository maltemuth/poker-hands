import express from "express";
import { spec } from "../spec";
import { createApiResponse, sendError } from "../utils";
import { holdSlotUntil } from "../middleware/rateLimiter";
import { CalculationError } from "../odds/runInWorker";
import { validateBody } from "../validation/requestValidator";
import { handlers, Handlers } from "./handlers";

const methods = ["get", "post", "put", "patch", "delete"] as const;

/**
 * Responds with the result of a handler. A calculation keeps its concurrency
 * slot until it finishes, even if the client disconnects.
 */
function respond(res: express.Response, run: () => unknown): void {
  const result = new Promise((resolve) => resolve(run()));
  holdSlotUntil(res, result);
  result
    .then((body) => {
      const response = createApiResponse(body);
      res.json(response);
    })
    .catch((error: Error) => {
      // the library rejected the cards (e.g. duplicates): a client error
      const status = error instanceof CalculationError ? 400 : 500;
      sendError(res, status, error.message);
    });
}

/**
 * Registers every operation in openapi.yaml: its path and method, request
 * validation for operations with a body, and the handler for its operationId.
 *
 * @param routeHandlers - The handler per operationId; tests pass their own
 * @throws {Error} If an operation in the spec has no handler
 */
export function setupRoutes(
  app: express.Application,
  routeHandlers: Handlers = handlers
): void {
  for (const [path, operations] of Object.entries(spec.paths)) {
    // OpenAPI writes path parameters as {name}, Express as :name
    const route = path.replace(/{([^}]+)}/g, ":$1");

    for (const method of methods) {
      const operation = operations[method];
      if (!operation) continue;

      const handler = routeHandlers[operation.operationId as keyof Handlers] as
        | ((body: unknown) => unknown)
        | undefined;
      if (!handler) {
        throw new Error(
          `No handler for ${
            operation.operationId
          } (${method.toUpperCase()} ${path})`
        );
      }

      const run: express.RequestHandler = (req, res) =>
        respond(res, () => handler(req.body));

      if (operation.requestBody) {
        app[method](route, validateBody(path, method), run);
      } else {
        app[method](route, run);
      }
    }
  }
}
