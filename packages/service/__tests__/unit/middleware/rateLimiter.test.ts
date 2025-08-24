import { createRateLimiter } from "../../../src/middleware/rateLimiter";
import { Request, Response } from "express";

describe("Rate Limiter Middleware", () => {
  let mockRequest: Partial<Request> & { path?: string; method?: string };
  let mockResponse: Partial<Response>;
  let next: jest.Mock;
  let rateLimiter: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      path: "/api/odds",
      method: "POST",
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      set: jest.fn(),
      on: jest.fn(),
    };
    next = jest.fn();
    rateLimiter = createRateLimiter({ maxConcurrentRequests: 5 });
  });

  it("should allow requests under the limit", () => {
    rateLimiter(mockRequest as Request, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should reject requests over the limit", () => {
    // Simulate 5 active requests
    for (let i = 0; i < 5; i++) {
      rateLimiter(mockRequest as Request, mockResponse as Response, next);
    }

    // 6th request should be rejected
    rateLimiter(mockRequest as Request, mockResponse as Response, next);
    expect(mockResponse.status).toHaveBeenCalledWith(429);
  });

  it("should exclude health check endpoint", () => {
    mockRequest.path = "/health";
    mockRequest.method = "GET";
    rateLimiter(mockRequest as Request, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should only apply to POST requests", () => {
    mockRequest.method = "GET";
    rateLimiter(mockRequest as Request, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should apply rate limiting to POST requests", () => {
    mockRequest.method = "POST";
    rateLimiter(mockRequest as Request, mockResponse as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return simple string for rejected requests", () => {
    // Simulate 5 active requests
    for (let i = 0; i < 5; i++) {
      rateLimiter(mockRequest as Request, mockResponse as Response, next);
    }

    // 6th request should be rejected
    rateLimiter(mockRequest as Request, mockResponse as Response, next);
    expect(mockResponse.json).toHaveBeenCalledWith(
      "Too many concurrent requests"
    );
  });
});
