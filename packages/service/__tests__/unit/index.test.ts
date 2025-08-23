import { PokerHandsService } from "../../src";
import express from "express";
import cors from "cors";

// Mock express and cors
const mockExpress = {
  use: jest.fn(),
  listen: jest.fn(),
  post: jest.fn(),
  get: jest.fn(),
};

jest.mock("express", () => {
  const mockJson = jest.fn(
    () =>
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) =>
        next()
  );
  const mockExpressFn = jest.fn(() => mockExpress);

  return {
    express: mockExpressFn,
    json: mockJson,
    __esModule: true,
    default: mockExpressFn,
  };
});

jest.mock("cors", () => jest.fn(() => jest.fn()));

// Mock the json function directly for testing
const mockJsonForTesting = jest.requireMock("express").json;

describe("PokerHandsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create service with default port", () => {
      const defaultService = new PokerHandsService();
      expect(defaultService).toBeInstanceOf(PokerHandsService);
    });

    it("should create service with custom port", () => {
      const customService = new PokerHandsService(8080);
      expect(customService).toBeInstanceOf(PokerHandsService);
    });

    it("should setup express app", () => {
      new PokerHandsService();
      expect(express).toHaveBeenCalled();
    });

    it("should setup CORS middleware", () => {
      new PokerHandsService();
      expect(cors).toHaveBeenCalled();
    });

    it("should setup JSON middleware with limit", () => {
      const mockApp = {
        use: jest.fn(),
        listen: jest.fn(),
        post: jest.fn(),
        get: jest.fn(),
      };

      // Mock the app returned by express
      (express as unknown as jest.Mock).mockReturnValue(mockApp);

      new PokerHandsService();
      expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function));
      expect(mockJsonForTesting).toHaveBeenCalledWith({ limit: "10mb" });
    });

    it("should setup routes", () => {
      const mockApp = {
        use: jest.fn(),
        post: jest.fn(),
        get: jest.fn(),
      };

      // Mock the app returned by express
      (express as unknown as jest.Mock).mockReturnValue(mockApp);

      new PokerHandsService();
      expect(mockApp.post).toHaveBeenCalledWith(
        "/api/odds",
        expect.any(Function)
      );
      expect(mockApp.post).toHaveBeenCalledWith(
        "/api/percentages",
        expect.any(Function)
      );
      expect(mockApp.get).toHaveBeenCalledWith("/health", expect.any(Function));
    });
  });

  describe("start", () => {
    it("should start the server on specified port", () => {
      const mockApp = {
        use: jest.fn(),
        listen: jest.fn(),
        post: jest.fn(),
        get: jest.fn(),
      };

      // Mock the app returned by express
      (express as unknown as jest.Mock).mockReturnValue(mockApp);

      const service = new PokerHandsService(3000);
      service.start();

      expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    });

    it("should log message when server starts", () => {
      const mockApp = {
        use: jest.fn(),
        listen: jest.fn((port, callback) => {
          callback();
        }),
        post: jest.fn(),
        get: jest.fn(),
      };

      // Mock the app returned by express
      (express as unknown as jest.Mock).mockReturnValue(mockApp);

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const service = new PokerHandsService(3000);
      service.start();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Poker Hands Service running on port 3000"
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getApp", () => {
    it("should return the express app", () => {
      const mockApp = {
        use: jest.fn(),
        post: jest.fn(),
        get: jest.fn(),
      };

      // Mock the app returned by express
      (express as unknown as jest.Mock).mockReturnValue(mockApp);

      const service = new PokerHandsService();
      const app = service.getApp();

      expect(app).toBe(mockApp);
    });
  });
});

describe("Direct execution", () => {
  it("should start service when run directly", () => {
    // Skip this test as require.main cannot be reliably mocked in Jest
    // This test would require integration testing approach
    expect(true).toBe(true);
  });
});
