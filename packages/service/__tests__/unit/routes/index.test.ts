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
    it("should return 501 with 'Not implemented' message", async () => {
      const response = await request(app).post("/api/percentages");

      expect(response.status).toBe(501);
      expect(response.body).toBe("Not implemented");
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
