import express from "express";
import request from "supertest";
import { setupRoutes } from "../../../src/routes";
import { runInWorker, CalculationError } from "../../../src/odds/runInWorker";

// calculate without starting worker threads; CalculationError stays real
jest.mock("../../../src/odds/runInWorker", () => ({
  ...jest.requireActual("../../../src/odds/runInWorker"),
  runInWorker: jest.fn(),
}));

const mockedRunInWorker = runInWorker as jest.MockedFunction<
  typeof runInWorker
>;

const odds = {
  players: [
    { holeCards: ["Ah", "Kh"], winChance: 0.65, tieChance: 0.05 },
    { holeCards: ["7c", "2d"], winChance: 0.3, tieChance: 0.05 },
  ],
};

describe("Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    setupRoutes(app);
  });

  describe("POST /api/odds", () => {
    const validInput = {
      holes: [
        ["Ah", "Kh"],
        ["7c", "2d"],
      ],
      board: ["Ts", "9h", "8c"],
      options: { mode: "monteCarlo", sampleSize: 1000 },
    };

    it("should return 400 for invalid input without calculating", async () => {
      const response = await request(app)
        .post("/api/odds")
        .send({ holes: [["Ah", "Kh"]] });

      expect(response.status).toBe(400);
      expect(response.body).toBe(
        "Holes must be provided as an array with at least 2 players"
      );
      expect(mockedRunInWorker).not.toHaveBeenCalled();
    });

    it("should calculate the request and return the odds", async () => {
      mockedRunInWorker.mockResolvedValue(odds);

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(odds);
      expect(mockedRunInWorker).toHaveBeenCalledWith("odds", validInput);
    });

    it("should return 400 when the library rejects the cards", async () => {
      mockedRunInWorker.mockRejectedValue(
        new CalculationError("Duplicate card: Ah")
      );

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(400);
      expect(response.body).toBe("Duplicate card: Ah");
    });

    it("should return 500 when the calculation fails otherwise", async () => {
      mockedRunInWorker.mockRejectedValue(new Error("Worker crashed"));

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(500);
      expect(response.body).toBe("Worker crashed");
    });

    it("should return 500 for a request without a body", async () => {
      const response = await request(app).post("/api/odds");

      expect(response.status).toBe(500);
      expect(response.body).toBe("Internal server error");
      expect(mockedRunInWorker).not.toHaveBeenCalled();
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

      expect(response.status).toBe(400);
      expect(response.body).toBe("Player 1 must have exactly 2 hole cards");
      expect(mockedRunInWorker).not.toHaveBeenCalled();
    });

    it("should calculate the request and return the percentages", async () => {
      mockedRunInWorker.mockResolvedValue(percentages);

      const response = await request(app)
        .post("/api/percentages")
        .send(validInput);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(percentages);
      expect(mockedRunInWorker).toHaveBeenCalledWith("percentages", validInput);
    });

    it("should return 400 when the library rejects the cards", async () => {
      mockedRunInWorker.mockRejectedValue(
        new CalculationError("Duplicates found in card list 'Ah,Kh,Ah'")
      );

      const response = await request(app)
        .post("/api/percentages")
        .send(validInput);

      expect(response.status).toBe(400);
      expect(response.body).toBe("Duplicates found in card list 'Ah,Kh,Ah'");
    });

    it("should return 500 for a request without a body", async () => {
      const response = await request(app).post("/api/percentages");

      expect(response.status).toBe(500);
      expect(response.body).toBe("Internal server error");
    });
  });

  describe("GET /health", () => {
    it("should return 200 with healthy status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "healthy" });
    });
  });
});
