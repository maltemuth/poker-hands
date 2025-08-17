import { cards } from "@malte.muth/poker-hands";

/**
 * Parse card strings from command line arguments
 */
export function parseCardInputs(cardStrings: string[]): any[] {
  try {
    // Validate card format before parsing
    const invalidCards = cardStrings.filter(
      (card) => !validateCardString(card)
    );
    if (invalidCards.length > 0) {
      throw new Error(formatCardError(invalidCards));
    }

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
    if (!validateCardString(card)) {
      throw new Error(
        `Invalid card format: "${card}". Cards should be in format like "2h", "Td", "As".`
      );
    }
    cards.push(card);
  }
  return cards;
}

/**
 * Validate that card strings are in the correct format
 */
export function validateCardStrings(cardStrings: string[]): boolean {
  return cardStrings.every((card) => validateCardString(card));
}

/**
 * Format error message for invalid cards
 */
export function formatCardError(invalidCards: string[]): string {
  return `Invalid card formats: ${invalidCards.join(
    ", "
  )}. Cards should be in format like "2h", "Td", "As".`;
}

/**
 * Parse a single card string
 */
export function parseCard(cardString: string): any {
  if (!validateCardString(cardString)) {
    throw new Error(
      `Invalid card format: "${cardString}". Cards should be in format like "2h", "Td", "As".`
    );
  }

  try {
    return cards(cardString)[0];
  } catch (error) {
    throw new Error(
      `Could not parse card "${cardString}": ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Parse hole cards (2 cards per player)
 */
export function parseHoleCards(holeString: string): any[] {
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
export function parseBoardCards(boardStrings: string[]): any[] {
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
 * Get all valid card values as strings
 */
export function getValidCardValues(): string[] {
  return ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
}

/**
 * Get all valid card suits as single characters
 */
export function getValidCardSuits(): string[] {
  return ["h", "d", "c", "s"];
}

/**
 * Format card for display
 */
export function formatCard(card: any): string {
  const valueMap: Record<number, string> = {
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "T",
    11: "J",
    12: "Q",
    13: "K",
    14: "A",
  };

  return `${valueMap[card.value]}${card.suit}`;
}

/**
 * Format multiple cards for display
 */
export function formatCards(cards: any[]): string {
  return cards.map(formatCard).join(", ");
}
