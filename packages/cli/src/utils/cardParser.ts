import { toString, cards, Card } from "@malte.muth/poker-hands";

/**
 * Unified card parsing function that handles all input formats
 * @param input - Can be a single string, array of strings, or space-separated string
 * @returns Parsed Card[]
 * @throws Error if input format is invalid
 */
export function parseCards(input: string): Card[] {
  return cards(...input.split(/([2-9TJQKA][hdsc])/).filter((_) => _));
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
