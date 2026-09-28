import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

/**
 * The parts of an OpenAPI operation the service reads at runtime
 */
export interface SpecOperation {
  operationId: string;
  requestBody?: {
    content: { "application/json": { schema: { $ref: string } } };
  };
}

/**
 * The service's API description, openapi.yaml, parsed once. It defines the
 * routes (setupRoutes) and the request validation (requestValidator).
 */
export const spec = parse(
  // openapi.yaml sits in the package root, one level above src/ and dist/
  readFileSync(join(__dirname, "../openapi.yaml"), "utf8")
) as {
  paths: Record<string, Partial<Record<string, SpecOperation>>>;
};
