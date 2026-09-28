import { Card } from "../card/Card";

/**
 * a player's hole cards
 */
export type Hole = Card[];

/**
 * win/tie statistics for one hole
 */
export interface HoleOdds {
  hole: Hole;
  wins: number;
  ties: number;
  winChance: number;
  tieChance: number;
  // Confidence interval for statistical accuracy (only in Monte Carlo results)
  winChanceError?: number;
  tieChanceError?: number;
}

/**
 * Callback function type for reporting calculation progress.
 *
 * This callback is used to report the progress of odds calculations,
 * allowing applications to show progress bars or update UI elements.
 * The progress value ranges from 0 to 1, where 0 represents 0% completion
 * and 1 represents 100% completion. The last report is always 1.
 *
 * @param progress - A number between 0 and 1 representing the completion percentage
 *
 * @example
 * ```typescript
 * const progressCallback = (progress: number) => {
 *   console.log(`Calculation progress: ${Math.round(progress * 100)}%`);
 * };
 *
 * const oddsResult = odds(holeCards, boardCards, { progress: progressCallback });
 * ```
 */
export type ProgressCallback = (progress: number) => void;
