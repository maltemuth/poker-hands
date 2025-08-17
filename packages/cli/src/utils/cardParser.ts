import { toString, cards, Card } from "@malte.muth/poker-hands";

/**
 * Unified card parsing function that handles all input formats
 * @param input - Can be a single string, array of strings, or space-separated string
 * @returns Parsed Card[]
 * @throws Error if input format is invalid
 */
export function parseCards(input: string | string[]): Card[] {
  // Normalize input to array of strings
  let cardStrings: string[];

  if (typeof input === "string") {
    // Handle space-separated strings and concatenated cards
    cardStrings = input.split(/\s+/).filter((s) => s.length > 0);
  } else {
    cardStrings = input;
  }

  // Validate each card string format
  for (const cardString of cardStrings) {
    if (!isValidCardString(cardString)) {
      throw new Error(
        `Invalid card format: "${cardString}". Expected format like "2h", "Td", "As"`
      );
    }
  }

  try {
    return cards(...cardStrings);
  } catch (error) {
    throw new Error(
      `Invalid card input: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Parse hole cards (exactly 2 cards per player)
 * @param input - Can be a single string or array of strings
 * @returns Parsed Card[]
 * @throws Error if not exactly 2 cards
 */
export function parseHoleCards(input: string | string[]): Card[] {
  const cards = parseCards(input);

  if (cards.length !== 2) {
    const inputStr =
      typeof input === "string" ? `"${input}"` : input.join(", ");
    throw new Error(
      `Hole cards must be exactly 2 cards, got ${cards.length}. Input: ${inputStr}`
    );
  }

  return cards;
}

/**
 * Parse board cards (0-5 cards)
 * @param input - Can be a single string or array of strings
 * @returns Parsed Card[]
 * @throws Error if more than 5 cards
 */
export function parseBoardCards(input: string | string[]): Card[] {
  const cards = parseCards(input);

  if (cards.length > 5) {
    const inputStr =
      typeof input === "string" ? `"${input}"` : input.join(", ");
    throw new Error(
      `Board cards cannot exceed 5 cards, got ${cards.length}. Input: ${inputStr}`
    );
  }

  return cards;
}

/**
 * Validate that a single card string is in the correct format
 */
function isValidCardString(cardString: string): boolean {
  const cardPattern = /^[2-9TJQKA][hdsc]$/i;
  return cardPattern.test(cardString);
}

/**
 * Format card for display
 */
export function formatCard(card: Card): string {
  return toString(card);
}

/**
 * Format multiple cards for display
 */
export function formatCards(cards: Card[]): string {
  return cards.map(formatCard).join(", ");
}
