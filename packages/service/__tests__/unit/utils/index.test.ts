import { validateOddsInput, createApiResponse } from "../../../src/utils";

describe("Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  describe("validateOddsInput with options", () => {
    it("should return null for valid input with mode option", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          mode: "exhaustive" as const,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
    });

    it("should return null for valid input with threshold option", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          threshold: 5000,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
    });

    it("should return null for valid input with sampleSize option", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          sampleSize: 1000,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
    });

    it("should return null for valid input with all options", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          mode: "monteCarlo" as const,
          threshold: 5000,
          sampleSize: 1000,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
    });

    it("should return error for invalid mode", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mode: "invalidMode" as any,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error:
          "Invalid mode: invalidMode. Must be one of: auto, exhaustive, monteCarlo",
      });
    });

    it("should return error for negative threshold", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          threshold: -100,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Threshold must be a positive number",
      });
    });

    it("should return error for zero threshold", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          threshold: 0,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Threshold must be a positive number",
      });
    });

    it("should return error for negative sampleSize", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          sampleSize: -100,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Sample size must be a positive number",
      });
    });

    it("should return error for zero sampleSize", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {
          sampleSize: 0,
        },
      };

      const result = validateOddsInput(input);
      expect(result).toEqual({
        error: "Sample size must be a positive number",
      });
    });

    it("should return null when options is undefined", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
    });

    it("should return null when options is empty object", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: {},
      };

      const result = validateOddsInput(input);
      expect(result).toBeNull();
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
