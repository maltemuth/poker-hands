import { toString, cards, Card } from "@malte.muth/poker-hands";

/**
 * Parse card strings from command line arguments
 */
export function parseCardInputs(cardStrings: string[]): Card[] {
  try {
    return cards(...cardStrings);
  } catch (error) {
    throw new Error(
      `Invalid card format: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Validate that a single card string is in the correct format
 */
export function validateCardString(cardString: string): boolean {
  const cardPattern = /^[2-9TJQKA][hdsc]$/i;
  return cardPattern.test(cardString);
}

/**
 * Parse concatenated card strings (e.g., "AsAhKd") into individual card strings
 */
export function parseConcatenatedCards(concatenatedString: string): string[] {
  // Split the string into 2-character segments
  const cards: string[] = [];
  for (let i = 0; i < concatenatedString.length; i += 2) {
    const card = concatenatedString.substring(i, i + 2);
    cards.push(card);
  }
  return cards;
}

/**
 * Parse hole cards (2 cards per player)
 */
export function parseHoleCards(holeString: string): Card[] {
  const cardStrings = holeString.split(" ").filter((s) => s.trim() !== "");

  if (cardStrings.length !== 2) {
    throw new Error(
      `Hole cards must be exactly 2 cards, got ${cardStrings.length}. Format: "2h Td"`
    );
  }

  return parseCardInputs(cardStrings);
}

/**
 * Parse board cards (0-5 cards)
 */
export function parseBoardCards(boardStrings: string[]): Card[] {
  if (boardStrings.length > 5) {
    throw new Error(
      `Board cards cannot exceed 5 cards, got ${boardStrings.length}.`
    );
  }

  if (boardStrings.length === 0) {
    return [];
  }

  return parseCardInputs(boardStrings);
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
