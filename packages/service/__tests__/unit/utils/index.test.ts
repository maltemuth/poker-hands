import {
  executeCliCommand,
  validateOddsInput,
  formatCliOutput,
  createApiResponse,
} from "../../../src/utils";

// Mock child_process.exec
jest.mock("child_process");
const { exec } = jest.requireMock("child_process");

describe("Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("executeCliCommand", () => {
    it("should resolve with stdout when command executes successfully", async () => {
      const mockStdout = "Command output";
      exec.mockImplementation(
        (
          command: string,
          callback: (
            error: Error | null,
            stdout: string,
            stderr: string
          ) => void
        ) => {
          callback(null, mockStdout, "");
        }
      );

      const result = await executeCliCommand("test command");
      expect(result).toBe(mockStdout);
      expect(exec).toHaveBeenCalledWith("test command", expect.any(Function));
    });

    it("should reject with stderr when command fails", async () => {
      const mockStderr = "Command error";
      exec.mockImplementation(
        (
          command: string,
          callback: (
            error: Error | null,
            stdout: string,
            stderr: string
          ) => void
        ) => {
          callback(new Error("Command failed"), "", mockStderr);
        }
      );

      await expect(executeCliCommand("failing command")).rejects.toThrow(
        "Command error"
      );
    });

    it("should reject with error message when stderr is empty", async () => {
      exec.mockImplementation(
        (
          command: string,
          callback: (
            error: Error | null,
            stdout: string,
            stderr: string
          ) => void
        ) => {
          callback(new Error("Command failed"), "", "");
        }
      );

      await expect(executeCliCommand("failing command")).rejects.toThrow(
        "Command failed"
      );
    });
  });

  describe("validateOddsInput", () => {
    it("should return null for valid input with holes and board", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: ["Ts", "9h", "8c"],
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
    });

    it("should return null for valid input with holes only", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
    });

    it("should return error when holes is not provided", () => {
      const input = {
        holes: [],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Holes must be provided as an array with at least 2 players",
      });
    });

    it("should return error when holes has less than 2 players", () => {
      const input = {
        holes: [["Ah", "Kh"]],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Holes must be provided as an array with at least 2 players",
      });
    });

    it("should return error when player does not have exactly 2 hole cards", () => {
      const input = {
        holes: [
          ["Ah", "Kh", "Qh"],
          ["7c", "2d"],
        ],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Player 1 must have exactly 2 hole cards",
      });
    });

    it("should return error when player's hole cards are not an array", () => {
      const input = {
        holes: [["not an array"], ["7c", "2d"]],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Player 1 must have exactly 2 hole cards",
      });
    });

    it("should return error for invalid card format", () => {
      const input = {
        holes: [
          ["Ah", "Kx"],
          ["7c", "2d"],
        ],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Invalid card format: Kx",
      });
    });

    it("should return error for invalid card format with non-string", () => {
      const input = {
        holes: [
          ["Ah", "123"],
          ["7c", "2d"],
        ],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Invalid card format: 123",
      });
    });

    it("should return error when board is not an array", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: ["not an array"],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Invalid board card format: not an array",
      });
    });

    it("should return error when board has more than 5 cards", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: ["Ts", "9h", "8c", "7h", "6h", "5h"],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Maximum 5 board cards allowed",
      });
    });

    it("should return error for invalid board card format", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: ["Ts", "9x", "8c"],
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Invalid board card format: 9x",
      });
    });

    it("should return null for empty board", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: [],
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
    });
  });

  describe("formatCliOutput", () => {
    it("should format CLI output correctly", () => {
      const cliOutput = JSON.stringify({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [
          {
            highCard: 0.15,
            pair: 0.25,
            twoPair: 0.1,
            threeOfAKind: 0.05,
            straight: 0.2,
            flush: 0.15,
            fullHouse: 0.05,
            fourOfAKind: 0.02,
            straightFlush: 0.02,
            royalFlush: 0.01,
          },
        ],
      });

      const result = formatCliOutput(cliOutput);
      expect(result).toEqual({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [
          {
            highCard: 0.15,
            pair: 0.25,
            twoPair: 0.1,
            threeOfAKind: 0.05,
            straight: 0.2,
            flush: 0.15,
            fullHouse: 0.05,
            fourOfAKind: 0.02,
            straightFlush: 0.02,
            royalFlush: 0.01,
          },
        ],
      });
    });

    it("should handle empty winProbabilities", () => {
      const cliOutput = JSON.stringify({
        winProbabilities: [],
        handTypeProbabilities: [],
      });

      const result = formatCliOutput(cliOutput);
      expect(result).toEqual({
        winProbabilities: [],
        handTypeProbabilities: [],
      });
    });

    it("should handle missing winProbabilities", () => {
      const cliOutput = JSON.stringify({
        handTypeProbabilities: [],
      });

      const result = formatCliOutput(cliOutput);
      expect(result).toEqual({
        winProbabilities: [],
        handTypeProbabilities: [],
      });
    });

    it("should handle missing handTypeProbabilities", () => {
      const cliOutput = JSON.stringify({
        winProbabilities: [0.65, 0.35],
      });

      const result = formatCliOutput(cliOutput);
      expect(result).toEqual({
        winProbabilities: [0.65, 0.35],
        handTypeProbabilities: [],
      });
    });
  });

  describe("createApiResponse", () => {
    it("should return data when provided", () => {
      const data = { status: "healthy" };
      const result = createApiResponse(data);
      expect(result).toBe(data);
    });

    it("should return error string when provided", () => {
      const error = "Not implemented";
      const result = createApiResponse(error);
      expect(result).toBe(error);
    });

    it("should return string data when type is different", () => {
      const data = "Some data";
      const result = createApiResponse<number>(data);
      expect(result).toBe(data);
    });
  });
});
