import { OddsRequest, OddsResponse, ApiResponse } from "../../../src/types";

describe("Type Definitions", () => {
  describe("OddsRequest", () => {
    it("should accept valid odds request with holes and board", () => {
      const request: OddsRequest = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: ["Ts", "9h", "8c"],
      };

      expect(request.holes).toHaveLength(2);
      expect(request.holes[0]).toHaveLength(2);
      expect(request.holes[1]).toHaveLength(2);
      expect(request.board).toHaveLength(3);
    });

    it("should accept valid odds request with holes only", () => {
      const request: OddsRequest = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
      };

      expect(request.holes).toHaveLength(2);
      expect(request.board).toBeUndefined();
    });

    it("should accept empty board", () => {
      const request: OddsRequest = {
        holes: [
          ["Ah", "Kh"],
          ["7c", "2d"],
        ],
        board: [],
      };

      expect(request.board).toHaveLength(0);
    });
  });

  describe("OddsResponse", () => {
    it("should accept valid odds response", () => {
      const response: OddsResponse = {
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
          {
            highCard: 0.25,
            pair: 0.3,
            twoPair: 0.15,
            threeOfAKind: 0.08,
            straight: 0.1,
            flush: 0.08,
            fullHouse: 0.03,
            fourOfAKind: 0.01,
            straightFlush: 0.0,
            royalFlush: 0.0,
          },
        ],
      };

      expect(response.winProbabilities).toHaveLength(2);
      expect(response.handTypeProbabilities).toHaveLength(2);
      expect(response.handTypeProbabilities[0]).toHaveProperty("highCard");
      expect(response.handTypeProbabilities[1]).toHaveProperty("royalFlush");
    });

    it("should accept empty win probabilities", () => {
      const response: OddsResponse = {
        winProbabilities: [],
        handTypeProbabilities: [],
      };

      expect(response.winProbabilities).toHaveLength(0);
      expect(response.handTypeProbabilities).toHaveLength(0);
    });
  });

  describe("ApiResponse", () => {
    it("should accept data as ApiResponse", () => {
      const data = { status: "healthy" };
      const response: ApiResponse<typeof data> = data;

      expect(response).toEqual(data);
    });

    it("should accept string as ApiResponse", () => {
      const error = "Not implemented";
      const response: ApiResponse<string> = error;

      expect(response).toBe(error);
    });

    it("should accept string as ApiResponse with different types", () => {
      const data = "Some data";
      const response: ApiResponse<number> = data;

      expect(response).toBe(data);
    });
  });
});
