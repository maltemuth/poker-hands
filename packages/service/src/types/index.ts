/**
 * Type definitions for the Poker Hands Service
 *
 * The request and response types are generated from openapi.yaml into
 * api.ts (`npm run generate`); edit the spec, not the generated file.
 */
import type { components } from "./api";

type Schemas = components["schemas"];

export type OddsRequest = Schemas["OddsRequest"];
export type OddsPlayerData = Schemas["OddsPlayerData"];
export type OddsData = Schemas["OddsData"];

export type PercentagesRequest = Schemas["PercentagesRequest"];
export type HandTypeData = Schemas["HandTypeData"];
export type PercentagesData = Schemas["PercentagesData"];
export type PercentagesPlayerData = Schemas["PercentagesPlayerData"];
export type PercentagesResponse = Schemas["PercentagesResponse"];

export type ErrorResponse = Schemas["ErrorResponse"];
