/**
 * Memoization utility that caches the result of a function call.
 * This is a simple implementation of memoization that ensures a function
 * is only executed once, and subsequent calls return the cached result.
 *
 * @template T The return type of the function to be memoized
 * @param F The function to memoize
 * @returns A new function that caches and returns the result of F
 *
 * @example
 * // Create an expensive function that will only be called once
 * const expensiveCalculation = purify(() => {
 *   console.log('Performing expensive calculation...');
 *   return Math.random();
 * });
 *
 * // First call executes the function
 * const result1 = expensiveCalculation(); // Logs "Performing expensive calculation..."
 *
 * // Subsequent calls return the cached result
 * const result2 = expensiveCalculation(); // No log message
 *
 * // Both results are the same
 * console.log(result1 === result2); // true
 */
const purify = <T>(F: () => T): (() => T) => {
  // Variable to store the calculated result
  let calculatedValue: T;

  // Flag to track if the function has been called before
  let valueHasBeenCalculated = false;

  // Return a new function that implements the memoization logic
  return () => {
    // If this is the first call, execute the original function
    if (!valueHasBeenCalculated) {
      calculatedValue = F();
      valueHasBeenCalculated = true;
    }

    // Return the cached result on subsequent calls
    return calculatedValue;
  };
};

export default purify;
