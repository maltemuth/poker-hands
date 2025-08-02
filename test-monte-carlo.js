const { cards } = require("./dist/index.js");
const { monteCarloOdds } = require("./dist/index.js");

console.log("Testing Monte Carlo implementation...");

// Test case 1: Pocket rockets vs tens
try {
  const results = monteCarloOdds(
    [cards("Ah", "As"), cards("Td", "Tc")],
    [],
    1000
  );

  console.log("Pocket rockets vs tens (1000 samples):");
  console.log(`AA win chance: ${(results[0].winChance * 100).toFixed(2)}%`);
  console.log(`TT win chance: ${(results[1].winChance * 100).toFixed(2)}%`);
  console.log(`Tie chance: ${(results[0].tieChance * 100).toFixed(2)}%`);
  console.log("Test passed!");
} catch (error) {
  console.error("Test failed:", error);
}

// Test case 2: With board
try {
  const results = monteCarloOdds(
    [cards("Ac", "Ad"), cards("Td", "Tc")],
    cards("7s", "8h", "Th"),
    1000
  );

  console.log("\nWith board (1000 samples):");
  console.log(`AA win chance: ${(results[0].winChance * 100).toFixed(2)}%`);
  console.log(`TT win chance: ${(results[1].winChance * 100).toFixed(2)}%`);
  console.log(`Tie chance: ${(results[0].tieChance * 100).toFixed(2)}%`);
  console.log("Test passed!");
} catch (error) {
  console.error("Test failed:", error);
}
