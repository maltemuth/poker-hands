import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateRequestBody } from "../../../src/validation/requestValidator.js";

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
      assert.equal(result, null);
    });

    it("should return null for valid input with holes only", () => {
      const input = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
      };

      const result = validateRequestBody("/api/odds", input);
      assert.equal(result, null);
    });

    it("should return error when holes is not provided", () => {
      const input = {
        holes: [],
      };

      const result = validateRequestBody("/api/odds", input);
      assert.deepEqual(result, {
        error: "Holes must be provided as an array with at least 2 players",
      });
    });

    it("should return error when holes has less than 2 players", () => {
      const input = {
        holes: [["Ah", "Kh"]],
      };

      const result = validateRequestBody("/api/odds", input);
      assert.deepEqual(result, {
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
      assert.deepEqual(result, {
        error: "Player 1 must have exactly 2 hole cards",
      });
    });

    it("should return error when player's hole cards are not an array", () => {
      const input = {
        holes: [["not an array"], ["7c", "2d"]],
      };

      const result = validateRequestBody("/api/odds", input);
      assert.deepEqual(result, {
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
      assert.deepEqual(result, {
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
      assert.deepEqual(result, {
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
      assert.deepEqual(result, {
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
      assert.deepEqual(result, {
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
      assert.deepEqual(result, {
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
      assert.equal(result, null);
    });
  });

  describe("odds requests with many players", () => {
    const holes = "AKQJT98765"
      .split("")
      .map((value) => [`${value}h`, `${value}d`]);

    it("should accept 10 players", () => {
      assert.equal(validateRequestBody("/api/odds", { holes }), null);
    });

    it("should return error for more than 10 players", () => {
      assert.deepEqual(
        validateRequestBody("/api/odds", { holes: [...holes, ["4h", "4d"]] }),
        { error: "At most 10 players allowed" }
      );
    });
  });

  describe("odds requests from older clients", () => {
    it("should ignore the options of Monte Carlo and auto mode", () => {
      assert.equal(
        validateRequestBody("/api/odds", {
          holes: [
            ["Ah", "Kh"],
            ["7c", "2d"],
          ],
          options: { mode: "monteCarlo", sampleSize: 50000 },
        }),
        null
      );
    });
  });

  describe("percentages requests", () => {
    it("should accept a single player", () => {
      assert.equal(
        validateRequestBody("/api/percentages", { holes: [["Ah", "Kh"]] }),
        null
      );
    });

    it("should accept several players and a board", () => {
      assert.equal(
        validateRequestBody("/api/percentages", {
          holes: [
            ["Ah", "Kh"],
            ["7c", "2d"],
          ],
          board: ["Ts", "9h", "8c"],
        }),
        null
      );
    });

    it("should accept at most 10 players", () => {
      const holes = "AKQJT98765"
        .split("")
        .map((value) => [`${value}h`, `${value}d`]);

      assert.equal(validateRequestBody("/api/percentages", { holes }), null);
      assert.deepEqual(
        validateRequestBody("/api/percentages", {
          holes: [...holes, ["4h", "4d"]],
        }),
        { error: "At most 10 players allowed" }
      );
    });

    it("should require at least one player", () => {
      assert.deepEqual(validateRequestBody("/api/percentages", { holes: [] }), {
        error: "Holes must be provided as an array with at least 1 player",
      });
    });

    it("should validate hole cards like odds", () => {
      assert.deepEqual(
        validateRequestBody("/api/percentages", { holes: [["Ah", "Xx"]] }),
        {
          error: "Invalid card format: Xx",
        }
      );
    });

    it("should validate the board like odds", () => {
      assert.deepEqual(
        validateRequestBody("/api/percentages", {
          holes: [["Ah", "Kh"]],
          board: ["2c", "3c", "4c", "5c", "6c", "7c"],
        }),
        { error: "Maximum 5 board cards allowed" }
      );
    });
  });

  describe("requests without a body", () => {
    it("should report the missing holes", () => {
      assert.deepEqual(validateRequestBody("/api/odds", undefined), {
        error: "Holes must be provided as an array with at least 2 players",
      });
    });
  });
});
