/**
 * Calculates the number of combinations (nCr) without generating them.
 * This is more efficient than generating all combinations when you only need the count.
 *
 * The formula for combinations is: nCr = n! / (r! * (n-r)!)
 * However, directly computing factorials can lead to very large numbers and overflow.
 * Instead, this implementation uses a multiplicative approach that:
 * 1. Multiplies n * (n-1) * ... * (n-r+1) for the numerator
 * 2. Divides by r * (r-1) * ... * 1 for the denominator
 * 3. Performs multiplication and division in alternating steps to keep intermediate values smaller
 *
 * Time complexity: O(r) - much more efficient than O(nCr) for generating combinations
 * Space complexity: O(1) - constant space usage
 *
 * @param n Total number of items
 * @param r Number of items to choose
 * @returns The number of combinations (nCr)
 *
 * @example
 * // Calculate number of 5-card hands from a 52-card deck
 * combinationCount(52, 5); // 2,598,960
 *
 * // Calculate number of ways to choose 2 cards from 5
 * combinationCount(5, 2); // 10
 *
 * // Edge cases
 * combinationCount(5, 6); // 0 (can't choose more than available)
 * combinationCount(5, 0); // 1 (one way to choose nothing)
 * combinationCount(5, 5); // 1 (one way to choose everything)
 */
const combinationCount = (n: number, r: number): number => {
  // Handle edge cases
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;

  // Use an optimized multiplicative formula to avoid large factorials
  // nCr = n * (n-1) * ... * (n-r+1) / (r * (r-1) * ... * 1)
  // By alternating multiplication and division, we keep intermediate values smaller

  let result = 1;
  for (let i = 0; i < r; i++) {
    // Multiply by (n - i) then divide by (i + 1)
    // This is equivalent to: result = result * (n - i) / (i + 1)
    result = (result * (n - i)) / (i + 1);
  }

  // Round to handle any floating point precision issues from division
  return Math.round(result);
};

export default combinationCount;
