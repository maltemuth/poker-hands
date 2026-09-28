import type { operations } from "../types/api";
import { runInWorker } from "../odds/runInWorker";

type JsonBody<Operation> = Operation extends {
  requestBody: { content: { "application/json": infer Body } };
}
  ? Body
  : undefined;

type OkBody<Operation> = Operation extends {
  responses: { 200: { content: { "application/json": infer Body } } };
}
  ? Body
  : never;

/**
 * Handles an operation: the validated request body in, the body of its 200
 * response out. Errors become 400 (CalculationError) or 500 responses.
 */
export type Handler<Operation> = (
  body: JsonBody<Operation>
) => OkBody<Operation> | Promise<OkBody<Operation>>;

/**
 * One handler per operationId in openapi.yaml, typed by the spec
 */
export type Handlers = {
  [OperationId in keyof operations]: Handler<operations[OperationId]>;
};

export const handlers: Handlers = {
  calculateOdds: (body) => runInWorker("odds", body),
  calculatePercentages: (body) => runInWorker("percentages", body),
  healthCheck: () => ({ status: "healthy" }),
};
