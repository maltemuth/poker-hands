/**
 * Calculates the number of combinations (nCr) without generating them
 * @param n Total number of items
 * @param r Number of items to choose
 * @returns The number of combinations
 */
const combinationCount = (n: number, r: number): number => {
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;

  // Use the more efficient formula: n! / (r! * (n-r)!)
  // But optimize to avoid large factorials:
  // nCr = n * (n-1) * ... * (n-r+1) / (r * (r-1) * ... * 1)

  let result = 1;
  for (let i = 0; i < r; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result); // Round to handle floating point precision issues
};

export default combinationCount;
