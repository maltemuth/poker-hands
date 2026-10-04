export interface HoleOdds {
  /** The hole's cards, as passed in */
  hole: string;
  /** Boards on which this hole alone has the best hand */
  wins: number;
  /** Boards on which this hole shares the best hand with others */
  ties: number;
  winChance: number;
  tieChance: number;
}

export type HandTypeName =
  | "highCard"
  | "pair"
  | "twoPair"
  | "threeOfAKind"
  | "straight"
  | "flush"
  | "fullHouse"
  | "fourOfAKind"
  | "straightFlush"
  | "royalFlush";

export type HandPercentages = Record<
  HandTypeName,
  { count: number; percentage: number }
>;

/**
 * The exact odds of each hole, over every way to complete the board. Cards
 * are strings like "AhKd"; whitespace between cards is allowed.
 *
 * @throws {Error} If a card is invalid or used twice, a hole doesn't have
 *   exactly two cards, or the board has more than five
 */
export function odds(holes: string[], board?: string): HoleOdds[];

/**
 * How often the hole makes each hand type, over every way to complete the
 * board; dead cards can't appear on it.
 */
export function percentages(
  hole: string,
  board?: string,
  dead?: string
): HandPercentages;

/**
 * The rank of the best five-card hand among up to seven cards: a better hand
 * has a higher rank, equally strong hands the same one. The same number as
 * handRank of @malte.muth/poker-hands.
 */
export function handRank(cards: string): number;
