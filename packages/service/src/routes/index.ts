/**
 * Route setup for the Poker Hands Service
 */

import express, { Request, Response } from "express";
import { PokerHandsService } from "../index";
import {
  BestHandRequest,
  BestHandResponse,
  CompareHandsRequest,
  CompareHandsResponse,
  OddsRequest,
  OddsResponse,
  PercentagesRequest,
  PercentagesResponse,
  ApiResponse,
  HandType,
  ApiError,
  ApiErrorType,
} from "../types";
import { validateCards, validateOddsRequest } from "../middleware";
import { formatResponse, createError } from "../utils";

// Import the poker hands library
import {
  getBestHand,
  isBetterThan,
  odds,
  percentages,
  cards,
} from "@malte.muth/poker-hands";

/**
 * Helper function to generate all combinations of k items from an array
 */
function getCombinations<T>(arr: T[], k: number): T[][] {
  const combinations: T[][] = [];

  function backtrack(start: number, current: T[]) {
    if (current.length === k) {
      combinations.push([...current]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return combinations;
}

/**
 * Setup routes for the Express application
 * @param app Express application instance
 */
export function setupRoutes(app: express.Application): void {
  // Best hand evaluation endpoint
  app.post(
    "/api/best-hand",
    validateCards,
    (req: Request, res: Response): void => {
      try {
        const { cards: cardStrings } = req.body as BestHandRequest;

        // Convert string cards to Card objects
        const cardObjects = cards(...cardStrings);

        // Get the best hand
        const bestHand = getBestHand(cardObjects);

        if (!bestHand) {
          const error = createError(
            400,
            "No valid hand could be formed from the provided cards"
          );
          res.status(400).json(formatResponse(false, undefined, error.message));
          return;
        }

        // Get all possible hands for detailed response
        const allHands: Array<{
          type: HandType;
          cards: string[];
          rank: number;
        }> = [];

        // Generate all possible 5-card combinations from the input cards
        const combinations = getCombinations(cardObjects, 5);

        for (const combo of combinations) {
          const hand = getBestHand(combo);
          if (hand) {
            allHands.push({
              type: hand.type,
              cards: hand
                .cards()
                .map((card: any) => `${card.value}${card.suit[0]}`),
              rank: hand.type,
            });
          }
        }

        const response: BestHandResponse = {
          hand: {
            type: bestHand.type,
            cards: bestHand
              .cards()
              .map((card: any) => `${card.value}${card.suit[0]}`),
            rank: bestHand.type,
          },
          allHands,
        };

        res.json({
          success: true,
          data: response,
          timestamp: new Date().toISOString(),
        } as ApiResponse<BestHandResponse>);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Internal server error";
        const errorObj = createError(500, errorMessage);
        res.status(500).json(formatResponse(false, undefined, errorMessage));
      }
    }
  );

  // Hand comparison endpoint
  app.post(
    "/api/compare",
    validateCards,
    (req: Request, res: Response): void => {
      try {
        const { hand1, hand2 } = req.body as CompareHandsRequest;

        // Convert string cards to Card objects
        const hand1Cards = cards(...hand1);
        const hand2Cards = cards(...hand2);

        // Get best hands for each
        const bestHand1 = getBestHand(hand1Cards);
        const bestHand2 = getBestHand(hand2Cards);

        if (!bestHand1 || !bestHand2) {
          res.status(400).json({
            success: false,
            error: "No valid hands could be formed from the provided cards",
            timestamp: new Date().toISOString(),
          } as ApiResponse);
          return;
        }

        // Compare hands
        const result = isBetterThan(bestHand1, bestHand2)
          ? "hand1"
          : isBetterThan(bestHand2, bestHand1)
          ? "hand2"
          : "tie";

        const response: CompareHandsResponse = {
          result,
          hands: {
            hand1: {
              type: bestHand1.type,
              cards: bestHand1
                .cards()
                .map((card: any) => `${card.value}${card.suit[0]}`),
              rank: bestHand1.type,
            },
            hand2: {
              type: bestHand2.type,
              cards: bestHand2
                .cards()
                .map((card: any) => `${card.value}${card.suit[0]}`),
              rank: bestHand2.type,
            },
          },
        };

        res.json({
          success: true,
          data: response,
          timestamp: new Date().toISOString(),
        } as ApiResponse<CompareHandsResponse>);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Internal server error";
        const errorObj = createError(500, errorMessage);
        res.status(500).json(formatResponse(false, undefined, errorMessage));
      }
    }
  );

  // Odds calculation endpoint
  app.post(
    "/api/odds",
    validateOddsRequest,
    (req: Request, res: Response): void => {
      try {
        const { holes, board = [] } = req.body as OddsRequest;

        // Convert string cards to Card objects
        const holeCards = holes.map((hole) => cards(...hole));
        const boardCards = board.length > 0 ? cards(...board) : [];

        // Calculate odds
        const oddsResult = odds(holeCards, boardCards);

        // Convert results to response format
        const winProbabilities = oddsResult.map(
          (result: any) => result.winChance
        );

        const handTypeProbabilities = oddsResult.map((result: any) => ({
          highCard: result.handTypePercentages?.highCard || 0,
          pair: result.handTypePercentages?.pair || 0,
          twoPair: result.handTypePercentages?.twoPair || 0,
          threeOfAKind: result.handTypePercentages?.threeOfAKind || 0,
          straight: result.handTypePercentages?.straight || 0,
          flush: result.handTypePercentages?.flush || 0,
          fullHouse: result.handTypePercentages?.fullHouse || 0,
          fourOfAKind: result.handTypePercentages?.fourOfAKind || 0,
          straightFlush: result.handTypePercentages?.straightFlush || 0,
          royalFlush: result.handTypePercentages?.royalFlush || 0,
        }));

        const response: OddsResponse = {
          winProbabilities,
          handTypeProbabilities,
        };

        res.json({
          success: true,
          data: response,
          timestamp: new Date().toISOString(),
        } as ApiResponse<OddsResponse>);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Internal server error";
        const errorObj = createError(500, errorMessage);
        res.status(500).json(formatResponse(false, undefined, errorMessage));
      }
    }
  );

  // Hand percentages endpoint
  app.post(
    "/api/percentages",
    validateCards,
    (req: Request, res: Response): void => {
      try {
        const { cards: cardStrings, board: boardStrings = [] } =
          req.body as PercentagesRequest;

        // Convert string cards to Card objects
        const cardObjects = cards(...cardStrings);
        const boardObjects =
          boardStrings.length > 0 ? cards(...boardStrings) : [];

        // Calculate percentages
        const percentagesResult = percentages(cardObjects, boardObjects);

        res.json({
          success: true,
          data: percentagesResult,
          timestamp: new Date().toISOString(),
        } as ApiResponse<PercentagesResponse>);
      } catch (error) {
        res.status(500).json({
          success: false,
          error:
            error instanceof Error ? error.message : "Internal server error",
          timestamp: new Date().toISOString(),
        } as ApiResponse);
      }
    }
  );

  // Info endpoint
  app.get("/api/info", (req: Request, res: Response): void => {
    res.json({
      success: true,
      data: {
        name: "Poker Hands Service",
        version: "0.1.0",
        description:
          "Service for poker hand evaluation, comparison, and odds calculation",
        endpoints: {
          "POST /api/best-hand":
            "Get the best possible hand from a set of cards",
          "POST /api/compare": "Compare two poker hands",
          "POST /api/odds": "Calculate winning odds for hole cards and board",
          "POST /api/percentages": "Calculate hand type percentages",
          "GET /api/info": "Service information",
          "GET /health": "Health check",
        },
        websocket: "ws://localhost:3000 (real-time calculations)",
      },
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  });
}
