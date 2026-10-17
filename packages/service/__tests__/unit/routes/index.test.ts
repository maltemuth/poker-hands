import assert from "node:assert/strict";
import { describe, it, beforeEach, mock } from "node:test";
import { isDeepStrictEqual } from "node:util";
import express from "express";
import request from "supertest";
import { setupRoutes } from "../../../src/routes/index.js";
import { handlers, Handlers } from "../../../src/routes/handlers.js";
import { CalculationError } from "../../../src/odds/CalculationError.js";

// the calculations are replaced; routing, validation and responses are real
const calculateOdds = mock.fn<Handlers["calculateOdds"]>();
const calculatePercentages = mock.fn<Handlers["calculatePercentages"]>();

const odds = {
  players: [
    { holeCards: ["Ah", "Kh"], winChance: 0.65, tieChance: 0.05 },
    { holeCards: ["7c", "2d"], winChance: 0.3, tieChance: 0.05 },
  ],
};

describe("Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    calculateOdds.mock.resetCalls();
    calculatePercentages.mock.resetCalls();
    app = express();
    app.use(express.json());
    setupRoutes(app, { ...handlers, calculateOdds, calculatePercentages });
  });

  describe("POST /api/odds", () => {
    const validInput = {
      holes: [
        ["Ah", "Kh"],
        ["7c", "2d"],
      ],
      board: ["Ts", "9h", "8c"],
    };

    it("should return 400 for invalid input without calculating", async () => {
      const response = await request(app)
        .post("/api/odds")
        .send({ holes: [["Ah", "Kh"]] });

      assert.equal(response.status, 400);
      assert.equal(
        response.body,
        "Holes must be provided as an array with at least 2 players"
      );
      assert.equal(calculateOdds.mock.callCount(), 0);
    });

    it("should calculate the request and return the odds", async () => {
      calculateOdds.mock.mockImplementation(async () => odds);

      const response = await request(app).post("/api/odds").send(validInput);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, odds);
      assert.ok(
        calculateOdds.mock.calls.some((call) =>
          isDeepStrictEqual(call.arguments, [validInput])
        )
      );
    });

    it("should return 400 when the library rejects the cards", async () => {
      calculateOdds.mock.mockImplementation(async () => {
        throw new CalculationError("Duplicate card: Ah");
      });

      const response = await request(app).post("/api/odds").send(validInput);

      assert.equal(response.status, 400);
      assert.equal(response.body, "Duplicate card: Ah");
    });

    it("should return 500 when the calculation fails otherwise", async () => {
      calculateOdds.mock.mockImplementation(async () => {
        throw new Error("Something went wrong");
      });

      const response = await request(app).post("/api/odds").send(validInput);

      assert.equal(response.status, 500);
      assert.equal(response.body, "Something went wrong");
    });

    it("should return 400 for a request without a body", async () => {
      const response = await request(app).post("/api/odds");

      assert.equal(response.status, 400);
      assert.equal(
        response.body,
        "Holes must be provided as an array with at least 2 players"
      );
      assert.equal(calculateOdds.mock.callCount(), 0);
    });
  });

  describe("POST /api/percentages", () => {
    const validInput = {
      holes: [
        ["Ah", "Kh"],
        ["7c", "2d"],
      ],
      board: ["Ts", "9h", "8c"],
    };

    const handTypes = {
      highCard: { count: 0, percentage: 0 },
      pair: { count: 400, percentage: 0.4 },
      twoPair: { count: 0, percentage: 0 },
      threeOfAKind: { count: 0, percentage: 0 },
      straight: { count: 600, percentage: 0.6 },
      flush: { count: 0, percentage: 0 },
      fullHouse: { count: 0, percentage: 0 },
      fourOfAKind: { count: 0, percentage: 0 },
      straightFlush: { count: 0, percentage: 0 },
      royalFlush: { count: 0, percentage: 0 },
    };
    const percentages = {
      players: [
        { holeCards: ["Ah", "Kh"], percentages: handTypes },
        { holeCards: ["7c", "2d"], percentages: handTypes },
      ],
    };

    it("should return 400 for invalid input without calculating", async () => {
      const response = await request(app)
        .post("/api/percentages")
        .send({ holes: [["Ah"]] });

      assert.equal(response.status, 400);
      assert.equal(response.body, "Player 1 must have exactly 2 hole cards");
      assert.equal(calculatePercentages.mock.callCount(), 0);
    });

    it("should calculate the request and return the percentages", async () => {
      calculatePercentages.mock.mockImplementation(async () => percentages);

      const response = await request(app)
        .post("/api/percentages")
        .send(validInput);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, percentages);
      assert.ok(
        calculatePercentages.mock.calls.some((call) =>
          isDeepStrictEqual(call.arguments, [validInput])
        )
      );
    });

    it("should return 400 when the library rejects the cards", async () => {
      calculatePercentages.mock.mockImplementation(async () => {
        throw new CalculationError("Duplicates found in card list 'Ah,Kh,Ah'");
      });

      const response = await request(app)
        .post("/api/percentages")
        .send(validInput);

      assert.equal(response.status, 400);
      assert.equal(response.body, "Duplicates found in card list 'Ah,Kh,Ah'");
    });

    it("should return 400 for a request without a body", async () => {
      const response = await request(app).post("/api/percentages");

      assert.equal(response.status, 400);
      assert.equal(
        response.body,
        "Holes must be provided as an array with at least 1 player"
      );
    });
  });

  describe("GET /health", () => {
    it("should return 200 with healthy status", async () => {
      const response = await request(app).get("/health");

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, { status: "healthy" });
    });
  });

  describe("registration from openapi.yaml", () => {
    it("should refuse to start without a handler for an operation", () => {
      const incomplete = {
        ...handlers,
        healthCheck: undefined,
      } as unknown as Handlers;

      assert.throws(() => setupRoutes(express(), incomplete), {
        message: "No handler for healthCheck (GET /health)",
      });
    });

    it("should answer 404 for paths the spec doesn't define", async () => {
      const response = await request(app).post("/api/unknown");

      assert.equal(response.status, 404);
    });
  });
});
