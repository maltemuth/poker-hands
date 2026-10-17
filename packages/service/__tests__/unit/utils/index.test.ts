import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import { isDeepStrictEqual } from "node:util";
import { Response } from "express";
import { sendError } from "../../../src/utils/index.js";

describe("sendError", () => {
  it("should send the message as a JSON string with the status", () => {
    const res = {
      status: mock.fn(function (this: unknown) {
        return this;
      }),
      json: mock.fn(),
    };

    sendError(res as unknown as Response, 429, "Too many concurrent requests");

    assert.ok(
      res.status.mock.calls.some((call) =>
        isDeepStrictEqual(call.arguments, [429])
      )
    );
    assert.ok(
      res.json.mock.calls.some((call) =>
        isDeepStrictEqual(call.arguments, ["Too many concurrent requests"])
      )
    );
  });
});
