import { validateRequestBody } from "../../../src/validation/requestValidator";

// the rules come from openapi.yaml; the messages are the service's own
describe("validateRequestBody", () => {
  describe("odds requests", () => {
    it("should return null for valid input with holes and board", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: ["Ts", "9h", "8c"],
      };

      const result = validateRequestBody("/api/odds", input);
      expect(result).toBeNull();
    });

    it("should return null for valid input with holes only", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
      };

      const result = validateRequestBody("/api/odds", input);
      expect(result).toBeNull();
    });

    it("should return error when holes is not provided", () => {
      const input = {
        holes: [],
      };

      const result = validateRequestBody("/api/odds", input);
      expect(result).toEqual({
        error: "Holes must be provided as an array with at least 2 players",
      });
    });

    it("should return error when holes has less than 2 players", () => {
      const input = {
        holes: [["Ah", "Kh"]],
      };

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
      expect(result).toEqual({
        error: "Player 1 must have exactly 2 hole cards",
      });
    });

    it("should return error when player's hole cards are not an array", () => {
      const input = {
        holes: [["not an array"], ["7c", "2d"]],
      };

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
      expect(result).toBeNull();
    });
  });

  describe("odds requests with many players", () => {
    const holes = "AKQJT98765"
      .split("")
      .map((value) => [`${value}h`, `${value}d`]);

    it("should accept 10 players", () => {
      expect(validateRequestBody("/api/odds", { holes })).toBeNull();
    });

    it("should return error for more than 10 players", () => {
      expect(
        validateRequestBody("/api/odds", { holes: [...holes, ["4h", "4d"]] })
      ).toEqual({ error: "At most 10 players allowed" });
    });
  });

  describe("odds requests with options", () => {
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
      expect(result).toEqual({
        error: "Threshold must be a positive integer",
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

      const result = validateRequestBody("/api/odds", input);
      expect(result).toEqual({
        error: "Threshold must be a positive integer",
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

      const result = validateRequestBody("/api/odds", input);
      expect(result).toEqual({
        error: "Sample size must be a positive integer",
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

      const result = validateRequestBody("/api/odds", input);
      expect(result).toEqual({
        error: "Sample size must be a positive integer",
      });
    });

    it("should accept a sampleSize of 1,000,000", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: { sampleSize: 1_000_000 },
      };

      expect(validateRequestBody("/api/odds", input)).toBeNull();
    });

    it("should return error for a sampleSize above 1,000,000", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        options: { sampleSize: 1_000_001 },
      };

      expect(validateRequestBody("/api/odds", input)).toEqual({
        error: "Sample size must be at most 1000000",
      });
    });

    it("should return null when options is undefined", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
      };

      const result = validateRequestBody("/api/odds", input);
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

      const result = validateRequestBody("/api/odds", input);
      expect(result).toBeNull();
    });
  });

  describe("percentages requests", () => {
    it("should accept a single player", () => {
      expect(
        validateRequestBody("/api/percentages", { holes: [["Ah", "Kh"]] })
      ).toBeNull();
    });

    it("should accept several players and a board", () => {
      expect(
        validateRequestBody("/api/percentages", {
          holes: [
            ["Ah", "Kh"],
            ["7c", "2d"],
          ],
          board: ["Ts", "9h", "8c"],
        })
      ).toBeNull();
    });

    it("should accept at most 10 players", () => {
      const holes = "AKQJT98765"
        .split("")
        .map((value) => [`${value}h`, `${value}d`]);

      expect(validateRequestBody("/api/percentages", { holes })).toBeNull();
      expect(
        validateRequestBody("/api/percentages", {
          holes: [...holes, ["4h", "4d"]],
        })
      ).toEqual({ error: "At most 10 players allowed" });
    });

    it("should require at least one player", () => {
      expect(validateRequestBody("/api/percentages", { holes: [] })).toEqual({
        error: "Holes must be provided as an array with at least 1 player",
      });
    });

    it("should validate hole cards like odds", () => {
      expect(
        validateRequestBody("/api/percentages", { holes: [["Ah", "Xx"]] })
      ).toEqual({
        error: "Invalid card format: Xx",
      });
    });

    it("should validate the board like odds", () => {
      expect(
        validateRequestBody("/api/percentages", {
          holes: [["Ah", "Kh"]],
          board: ["2c", "3c", "4c", "5c", "6c", "7c"],
        })
      ).toEqual({ error: "Maximum 5 board cards allowed" });
    });
  });

  describe("requests without a body", () => {
    it("should report the missing holes", () => {
      expect(validateRequestBody("/api/odds", undefined)).toEqual({
        error: "Holes must be provided as an array with at least 2 players",
      });
    });
  });

  describe("rules only the spec defines", () => {
    it("should reject a fractional sample size", () => {
      expect(
        validateRequestBody("/api/odds", {
          holes: [
            ["Ah", "Kh"],
            ["7c", "2d"],
          ],
          options: { sampleSize: 2.5 },
        })
      ).toEqual({ error: "Sample size must be a positive integer" });
    });
  });
});
