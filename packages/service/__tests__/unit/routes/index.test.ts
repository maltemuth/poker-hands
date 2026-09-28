import express from "express";
import request from "supertest";
import { setupRoutes } from "../../../src/routes";

// Mock the utils
jest.mock("../../../src/utils", () => ({
  validateOddsInput: jest.fn(),
  executeCliCommand: jest.fn(),
  formatCliOutput: jest.fn(),
  createApiResponse: jest.fn(),
}));

// Import the mocked functions
const mockedUtils = jest.requireMock("../../../src/utils");
const {
  validateOddsInput,
  executeCliCommand,
  formatCliOutput,
  createApiResponse,
} = mockedUtils;

describe("Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    setupRoutes(app);
  });

  describe("POST /api/odds", () => {
    it("should return 400 for invalid input", async () => {
      const invalidInput = {
        holes: [["Ah", "Kh"]], // Only one player
      };

      validateOddsInput.mockReturnValue({ error: "Invalid input" });

      const response = await request(app).post("/api/odds").send(invalidInput);

      expect(response.status).toBe(400);
      expect(createApiResponse).toHaveBeenCalledWith("Invalid input");
    });

    it("should execute CLI command for valid input", async () => {
      const validInput = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: ["Ts", "9h", "8c"],
      };

      validateOddsInput.mockReturnValue(null);
      executeCliCommand.mockResolvedValue(
        '{"success": true, "command": "odds", "data": {"players": [{"holeCards": ["Ah", "Kh"], "winChance": 0.65, "tieChance": 0.05}, {"holeCards": ["7c", "2d"], "winChance": 0.35, "tieChance": 0.05}]}}'
      );
      formatCliOutput.mockReturnValue({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [],
      });

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(200);
      expect(executeCliCommand).toHaveBeenCalledWith(
        "npx poker-hands odds AhKh 7c2d --board Ts9h8c --json"
      );
      expect(formatCliOutput).toHaveBeenCalledWith(
        '{"success": true, "command": "odds", "data": {"players": [{"holeCards": ["Ah", "Kh"], "winChance": 0.65, "tieChance": 0.05}, {"holeCards": ["7c", "2d"], "winChance": 0.35, "tieChance": 0.05}]}}'
      );
    });

    it("should execute CLI command with mode option", async () => {
      const validInput = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          mode: "exhaustive",
        },
      };

      validateOddsInput.mockReturnValue(null);
      executeCliCommand.mockResolvedValue(
        '{"success": true, "command": "odds", "data": {"players": [{"holeCards": ["Ah", "Kh"], "winChance": 0.65, "tieChance": 0.05}, {"holeCards": ["7c", "2d"], "winChance": 0.35, "tieChance": 0.05}]}}'
      );
      formatCliOutput.mockReturnValue({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [],
      });

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(200);
      expect(executeCliCommand).toHaveBeenCalledWith(
        "npx poker-hands odds AhKh 7c2d --mode exhaustive --json"
      );
    });

    it("should execute CLI command with threshold option", async () => {
      const validInput = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          threshold: 5000,
        },
      };

      validateOddsInput.mockReturnValue(null);
      executeCliCommand.mockResolvedValue(
        '{"success": true, "command": "odds", "data": {"players": [{"holeCards": ["Ah", "Kh"], "winChance": 0.65, "tieChance": 0.05}, {"holeCards": ["7c", "2d"], "winChance": 0.35, "tieChance": 0.05}]}}'
      );
      formatCliOutput.mockReturnValue({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [],
      });

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(200);
      expect(executeCliCommand).toHaveBeenCalledWith(
        "npx poker-hands odds AhKh 7c2d --threshold 5000 --json"
      );
    });

    it("should execute CLI command with sampleSize option", async () => {
      const validInput = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          sampleSize: 1000,
        },
      };

      validateOddsInput.mockReturnValue(null);
      executeCliCommand.mockResolvedValue(
        '{"success": true, "command": "odds", "data": {"players": [{"holeCards": ["Ah", "Kh"], "winChance": 0.65, "tieChance": 0.05}, {"holeCards": ["7c", "2d"], "winChance": 0.35, "tieChance": 0.05}]}}'
      );
      formatCliOutput.mockReturnValue({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [],
      });

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(200);
      expect(executeCliCommand).toHaveBeenCalledWith(
        "npx poker-hands odds AhKh 7c2d --sample-size 1000 --json"
      );
    });

    it("should execute CLI command with all options", async () => {
      const validInput = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          mode: "monteCarlo",
          threshold: 5000,
          sampleSize: 1000,
        },
      };

      validateOddsInput.mockReturnValue(null);
      executeCliCommand.mockResolvedValue(
        '{"success": true, "command": "odds", "data": {"players": [{"holeCards": ["Ah", "Kh"], "winChance": 0.65, "tieChance": 0.05}, {"holeCards": ["7c", "2d"], "winChance": 0.35, "tieChance": 0.05}]}}'
      );
      formatCliOutput.mockReturnValue({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [],
      });

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(200);
      expect(executeCliCommand).toHaveBeenCalledWith(
        "npx poker-hands odds AhKh 7c2d --mode monteCarlo --threshold 5000 --sample-size 1000 --json"
      );
    });

    it("should execute CLI command with board and options", async () => {
      const validInput = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: ["Ts", "9h", "8c"],
        options: {
          mode: "exhaustive",
          threshold: 5000,
        },
      };

      validateOddsInput.mockReturnValue(null);
      executeCliCommand.mockResolvedValue(
        '{"success": true, "command": "odds", "data": {"players": [{"holeCards": ["Ah", "Kh"], "winChance": 0.65, "tieChance": 0.05}, {"holeCards": ["7c", "2d"], "winChance": 0.35, "tieChance": 0.05}]}}'
      );
      formatCliOutput.mockReturnValue({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [],
      });

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(200);
      expect(executeCliCommand).toHaveBeenCalledWith(
        "npx poker-hands odds AhKh 7c2d --board Ts9h8c --mode exhaustive --threshold 5000 --json"
      );
    });

    it("should return 500 when CLI command fails", async () => {
      const validInput = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
      };

      validateOddsInput.mockReturnValue(null);
      executeCliCommand.mockRejectedValue(new Error("CLI error"));

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(500);
      expect(createApiResponse).toHaveBeenCalledWith("CLI error");
    });

    it("should return 500 for unexpected errors", async () => {
      const validInput = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
      };

      validateOddsInput.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const response = await request(app).post("/api/odds").send(validInput);

      expect(response.status).toBe(500);
      expect(createApiResponse).toHaveBeenCalledWith("Internal server error");
    });
  });

  describe("POST /api/percentages", () => {
    it("should return 501 with 'Not implemented' message", async () => {
      const response = await request(app).post("/api/percentages").send({});

      expect(response.status).toBe(501);
      expect(createApiResponse).toHaveBeenCalledWith("Not implemented");
    });
  });

  describe("GET /health", () => {
    it("should return 200 with healthy status", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(createApiResponse).toHaveBeenCalledWith({ status: "healthy" });
    });
  });
});
