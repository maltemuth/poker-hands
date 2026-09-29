import type { operations } from "../types/api";
import calculateOdds from "../odds/calculateOdds";
import calculatePercentages from "../odds/calculatePercentages";
import { CalculationError } from "../odds/CalculationError";

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

/**
 * Runs a calculation directly: with the request limits in openapi.yaml, even
 * the largest takes a fraction of a second. Whatever the library throws for a
 * validated request, e.g. a card used twice, is the client's error.
 */
const calculate =
  <Request, Result>(run: (request: Request) => Result) =>
  (request: Request): Result => {
    try {
      return run(request);
    } catch (error) {
      throw new CalculationError(
        error instanceof Error ? error.message : String(error)
      );
    }
  };

export const handlers: Handlers = {
  calculateOdds: calculate(calculateOdds),
  calculatePercentages: calculate(calculatePercentages),
  healthCheck: () => ({ status: "healthy" }),
};
