import { cards, Card } from "@malte.muth/poker-hands";

/**
 * Unified card parsing function that handles all input formats
 * @param input - Can be a single string, array of strings, or space-separated string
 * @returns Parsed Card[]
 * @throws Error if input format is invalid
 */
export function parseCards(input: string): Card[] {
  // whitespace between cards is allowed, anything else is left for cards() to reject
  return cards(
    ...input.split(/([2-9TJQKA][hdsc])/).filter((part) => part.trim() !== "")
  );
}
