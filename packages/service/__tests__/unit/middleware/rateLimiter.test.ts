import assert from "node:assert/strict";
import { describe, it, beforeEach, mock, type Mock } from "node:test";
import { isDeepStrictEqual } from "node:util";
import { EventEmitter } from "events";
import { createRateLimiter } from "../../../src/middleware/rateLimiter.js";
import { Request, Response } from "express";

/** The response methods the limiter calls, as mocks; status returns the response, as Express's does */
const responseMocks = () => ({
  status: mock.fn(function (this: unknown) {
    return this;
  }),
  json: mock.fn(),
  locals: {},
});

describe("Rate Limiter Middleware", () => {
  let mockRequest: Partial<Request> & { path?: string; method?: string };
  let mockResponse: ReturnType<typeof responseMocks>;
  let next: Mock<() => void>;
  let rateLimiter: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      path: "/api/odds",
      method: "POST",
    };
    mockResponse = Object.assign(responseMocks(), {
      set: mock.fn(),
      on: mock.fn(),
    });
    next = mock.fn(() => {});
    rateLimiter = createRateLimiter({ maxConcurrentRequests: 5 });
  });

  it("should allow requests under the limit", () => {
    rateLimiter(
      mockRequest as Request,
      mockResponse as unknown as Response,
      next
    );
    assert.ok(next.mock.callCount() > 0);
  });

  it("should reject requests over the limit", () => {
    // Simulate 5 active requests
    for (let i = 0; i < 5; i++) {
      rateLimiter(
        mockRequest as Request,
        mockResponse as unknown as Response,
        next
      );
    }

    // 6th request should be rejected
    rateLimiter(
      mockRequest as Request,
      mockResponse as unknown as Response,
      next
    );
    assert.ok(
      mockResponse.status.mock.calls.some((call) =>
        isDeepStrictEqual(call.arguments, [429])
      )
    );
  });

  it("should exclude health check endpoint", () => {
    mockRequest.path = "/health";
    mockRequest.method = "GET";
    rateLimiter(
      mockRequest as Request,
      mockResponse as unknown as Response,
      next
    );
    assert.ok(next.mock.callCount() > 0);
  });

  it("should only apply to POST requests", () => {
    mockRequest.method = "GET";
    rateLimiter(
      mockRequest as Request,
      mockResponse as unknown as Response,
      next
    );
    assert.ok(next.mock.callCount() > 0);
  });

  it("should apply rate limiting to POST requests", () => {
    mockRequest.method = "POST";
    rateLimiter(
      mockRequest as Request,
      mockResponse as unknown as Response,
      next
    );
    assert.ok(next.mock.callCount() > 0);
  });

  it("should return simple string for rejected requests", () => {
    // Simulate 5 active requests
    for (let i = 0; i < 5; i++) {
      rateLimiter(
        mockRequest as Request,
        mockResponse as unknown as Response,
        next
      );
    }

    // 6th request should be rejected
    rateLimiter(
      mockRequest as Request,
      mockResponse as unknown as Response,
      next
    );
    assert.ok(
      mockResponse.json.mock.calls.some((call) =>
        isDeepStrictEqual(call.arguments, ["Too many concurrent requests"])
      )
    );
  });

  describe("slot lifetime", () => {
    // a response that can actually emit "finish" and "close"
    const createResponse = () =>
      Object.assign(new EventEmitter(), responseMocks());

    beforeEach(() => {
      rateLimiter = createRateLimiter({ maxConcurrentRequests: 1 });
    });

    it("frees the slot once when the response ends", () => {
      const first = createResponse();
      rateLimiter(mockRequest as Request, first as unknown as Response, next);
      first.emit("finish");
      first.emit("close");

      const second = createResponse();
      rateLimiter(mockRequest as Request, second as unknown as Response, next);
      assert.equal(second.status.mock.callCount(), 0);
      assert.equal(next.mock.callCount(), 2);

      // "finish" and "close" together freed one slot, not two
      const third = createResponse();
      rateLimiter(mockRequest as Request, third as unknown as Response, next);
      assert.ok(
        third.status.mock.calls.some((call) =>
          isDeepStrictEqual(call.arguments, [429])
        )
      );
    });

    it("frees the slot when the client disconnects", () => {
      const first = createResponse();
      rateLimiter(mockRequest as Request, first as unknown as Response, next);
      first.emit("close");

      const second = createResponse();
      rateLimiter(mockRequest as Request, second as unknown as Response, next);
      assert.equal(second.status.mock.callCount(), 0);
    });
  });
});
