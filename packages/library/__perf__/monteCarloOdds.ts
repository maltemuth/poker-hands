import exhaustive from "../src/model/odds/exhaustive";
import monteCarloOdds from "../src/model/odds/monteCarloOdds";
import cards from "../src/model/card/cards";
import withProfiling from "./withProfiling";

const percent = (value = 0) => `${(value * 100).toFixed(2)}%`;

// Test performance comparison
const runPerformanceTest = () => {
  console.log("=== Performance Comparison ===");

  // Test case 1: Preflop all-in scenario
  console.log("\n1. Preflop all-in (AA vs TT):");
  console.time("Exhaustive");
  const exhaustive1 = exhaustive([cards("Ah", "As"), cards("Td", "Tc")]);
  console.timeEnd("Exhaustive");
  console.log(
    `Exhaustive - AA win: ${percent(exhaustive1[0].winChance)}, TT win: ${percent(exhaustive1[1].winChance)}`
  );

  console.time("Monte Carlo (10k)");
  const monteCarlo1 = monteCarloOdds(
    [cards("Ah", "As"), cards("Td", "Tc")],
    [],
    10000
  );
  console.timeEnd("Monte Carlo (10k)");
  console.log(
    `Monte Carlo - AA win: ${percent(monteCarlo1[0].winChance)} ± ${percent(monteCarlo1[0].winChanceError)}, TT win: ${percent(monteCarlo1[1].winChance)} ± ${percent(monteCarlo1[1].winChanceError)}`
  );

  // Test case 2: Flop scenario
  console.log("\n2. Flop scenario (AA vs TT with board):");
  console.time("Exhaustive");
  const exhaustive2 = exhaustive(
    [cards("Ah", "As"), cards("Td", "Tc")],
    cards("7c", "7d", "6s")
  );
  console.timeEnd("Exhaustive");
  console.log(
    `Exhaustive - AA win: ${percent(exhaustive2[0].winChance)}, TT win: ${percent(exhaustive2[1].winChance)}`
  );

  console.time("Monte Carlo (10k)");
  const monteCarlo2 = monteCarloOdds(
    [cards("Ah", "As"), cards("Td", "Tc")],
    cards("7c", "7d", "6s"),
    10000
  );
  console.timeEnd("Monte Carlo (10k)");
  console.log(
    `Monte Carlo - AA win: ${percent(monteCarlo2[0].winChance)} ± ${percent(monteCarlo2[0].winChanceError)}, TT win: ${percent(monteCarlo2[1].winChance)} ± ${percent(monteCarlo2[1].winChanceError)}`
  );

  // Test case 3: Turn scenario
  console.log("\n3. Turn scenario (AA vs TT with board):");
  console.time("Exhaustive");
  const exhaustive3 = exhaustive(
    [cards("Ac", "Ad"), cards("Td", "Tc")],
    cards("7s", "8h", "Th", "9s")
  );
  console.timeEnd("Exhaustive");
  console.log(
    `Exhaustive - AA win: ${percent(exhaustive3[0].winChance)}, TT win: ${percent(exhaustive3[1].winChance)}`
  );

  console.time("Monte Carlo (10k)");
  const monteCarlo3 = monteCarloOdds(
    [cards("Ac", "Ad"), cards("Td", "Tc")],
    cards("7s", "8h", "Th", "9s"),
    10000
  );
  console.timeEnd("Monte Carlo (10k)");
  console.log(
    `Monte Carlo - AA win: ${percent(monteCarlo3[0].winChance)} ± ${percent(monteCarlo3[0].winChanceError)}, TT win: ${percent(monteCarlo3[1].winChance)} ± ${percent(monteCarlo3[1].winChanceError)}`
  );

  // Test case 4: Performance with different sample sizes
  console.log("\n4. Monte Carlo performance with different sample sizes:");
  const holes = [cards("Ac", "Kc"), cards("Td", "Tc"), cards("9d", "7h")];

  [1000, 5000, 10000, 50000].forEach((sampleSize) => {
    console.time(`Monte Carlo (${sampleSize})`);
    monteCarloOdds(holes, [], sampleSize);
    console.timeEnd(`Monte Carlo (${sampleSize})`);
  });
};

withProfiling(runPerformanceTest, "monteCarloOdds");
