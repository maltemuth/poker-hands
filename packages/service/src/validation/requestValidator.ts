import Ajv, { ErrorObject, ValidateFunction } from "ajv";
import express from "express";
import { spec } from "../spec";
import { sendError } from "../utils";

type ValidationError = { error: string } | null;

// the whole spec is one schema document, so the spec's own $refs resolve
const ajv = new Ajv({ strict: false });
ajv.addSchema(spec, "openapi");

const validators = new Map<string, ValidateFunction>();

/**
 * The validator for the JSON request body of an operation, as the spec
 * defines it
 */
const validatorFor = (path: string, method: string): ValidateFunction => {
  const key = `${method} ${path}`;
  const cached = validators.get(key);
  if (cached) return cached;

  const reference =
    spec.paths[path]?.[method]?.requestBody?.content["application/json"].schema
      .$ref;
  if (!reference) {
    throw new Error(`openapi.yaml defines no JSON request body for ${key}`);
  }

  const validate = ajv.getSchema(`openapi${reference}`);
  if (!validate) {
    throw new Error(`openapi.yaml does not resolve ${reference}`);
  }

  validators.set(key, validate);
  return validate;
};

/**
 * Reads the value at a JSON pointer like "/holes/0/1" from the body
 */
const valueAt = (body: unknown, pointer: string): unknown =>
  pointer
    .split("/")
    .slice(1)
    .reduce<unknown>(
      (value, key) => (value as Record<string, unknown> | undefined)?.[key],
      body
    );

/**
 * Turns the first schema violation into the service's error messages
 */
const toMessage = (
  error: ErrorObject,
  body: unknown,
  minPlayers: number
): string => {
  const path = error.instancePath;
  const value = valueAt(body, path);
  const segments = path.split("/").slice(1);

  if (path === "" || path === "/holes") {
    const players = minPlayers === 1 ? "player" : "players";
    return `Holes must be provided as an array with at least ${minPlayers} ${players}`;
  }
  if (segments[0] === "holes" && segments.length === 2) {
    return `Player ${Number(segments[1]) + 1} must have exactly 2 hole cards`;
  }
  if (segments[0] === "holes" && segments.length === 3) {
    return `Invalid card format: ${value}`;
  }
  if (path === "/board") {
    return error.keyword === "maxItems"
      ? `Maximum ${error.params.limit} board cards allowed`
      : "Board must be provided as an array";
  }
  if (segments[0] === "board") {
    return `Invalid board card format: ${value}`;
  }
  if (path === "/options/mode") {
    return `Invalid mode: ${value}. Must be one of: ${error.params.allowedValues.join(
      ", "
    )}`;
  }
  if (path === "/options/threshold") {
    return "Threshold must be a positive integer";
  }
  if (path === "/options/sampleSize") {
    return "Sample size must be a positive integer";
  }
  return `${path.slice(1) || "body"} ${error.message}`;
};

/**
 * Validates a request body against the spec's schema for the operation.
 *
 * @param path - The operation's path in openapi.yaml, e.g. "/api/odds"
 * @param body - The parsed request body
 * @param method - The operation's HTTP method in openapi.yaml
 * @returns The first violation as the service's error message, or null
 */
export const validateRequestBody = (
  path: string,
  body: unknown,
  method = "post"
): ValidationError => {
  const validate = validatorFor(path, method);
  // a request without a JSON body is validated as an empty object
  const input = body ?? {};
  if (validate(input)) return null;

  const minPlayers = (
    validate.schema as { properties: { holes: { minItems: number } } }
  ).properties.holes.minItems;
  return { error: toMessage(validate.errors![0], input, minPlayers) };
};

/**
 * Middleware answering 400 when the request body doesn't match the spec
 */
export const validateBody =
  (path: string, method = "post"): express.RequestHandler =>
  (req, res, next) => {
    const validationError = validateRequestBody(path, req.body, method);
    if (validationError) {
      sendError(res, 400, validationError.error);
      return;
    }
    next();
  };
