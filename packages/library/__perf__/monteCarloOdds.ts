import exhaustive from "../src/model/odds/exhaustive";
import monteCarloOdds from "../src/model/odds/monteCarloOdds";
import cards from "../src/model/card/cards";
import withProfiling from "./withProfiling";

// Test performance comparison
const runPerformanceTest = () => {
  console.log("=== Performance Comparison ===");

  // Test case 1: Preflop all-in scenario
  console.log("\n1. Preflop all-in (AA vs TT):");
  console.time("Exhaustive");
  const exhaustive1 = exhaustive([cards("Ah", "As"), cards("Td", "Tc")]);
  console.timeEnd("Exhaustive");
  console.log(
    `Exhaustive - AA win: ${(exhaustive1[0].winChance * 100).toFixed(
      2
    )}%, TT win: ${(exhaustive1[1].winChance * 100).toFixed(2)}%`
  );

  console.time("Monte Carlo (10k)");
  const monteCarlo1 = monteCarloOdds(
    [cards("Ah", "As"), cards("Td", "Tc")],
    [],
    10000
  );
  console.timeEnd("Monte Carlo (10k)");
  console.log(
    `Monte Carlo - AA win: ${(monteCarlo1[0].winChance * 100).toFixed(2)}% ± ${(
      monteCarlo1[0].winChanceError! * 100
    ).toFixed(2)}%, TT win: ${(monteCarlo1[1].winChance * 100).toFixed(
      2
    )}% ± ${(monteCarlo1[1].winChanceError! * 100).toFixed(2)}%`
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
    `Exhaustive - AA win: ${(exhaustive2[0].winChance * 100).toFixed(
      2
    )}%, TT win: ${(exhaustive2[1].winChance * 100).toFixed(2)}%`
  );

  console.time("Monte Carlo (10k)");
  const monteCarlo2 = monteCarloOdds(
    [cards("Ah", "As"), cards("Td", "Tc")],
    cards("7c", "7d", "6s"),
    10000
  );
  console.timeEnd("Monte Carlo (10k)");
  console.log(
    `Monte Carlo - AA win: ${(monteCarlo2[0].winChance * 100).toFixed(2)}% ± ${(
      monteCarlo2[0].winChanceError! * 100
    ).toFixed(2)}%, TT win: ${(monteCarlo2[1].winChance * 100).toFixed(
      2
    )}% ± ${(monteCarlo2[1].winChanceError! * 100).toFixed(2)}%`
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
    `Exhaustive - AA win: ${(exhaustive3[0].winChance * 100).toFixed(
      2
    )}%, TT win: ${(exhaustive3[1].winChance * 100).toFixed(2)}%`
  );

  console.time("Monte Carlo (10k)");
  const monteCarlo3 = monteCarloOdds(
    [cards("Ac", "Ad"), cards("Td", "Tc")],
    cards("7s", "8h", "Th", "9s"),
    10000
  );
  console.timeEnd("Monte Carlo (10k)");
  console.log(
    `Monte Carlo - AA win: ${(monteCarlo3[0].winChance * 100).toFixed(2)}% ± ${(
      monteCarlo3[0].winChanceError! * 100
    ).toFixed(2)}%, TT win: ${(monteCarlo3[1].winChance * 100).toFixed(
      2
    )}% ± ${(monteCarlo3[1].winChanceError! * 100).toFixed(2)}%`
  );

  // Test case 4: Performance with different sample sizes
  console.log("\n4. Monte Carlo performance with different sample sizes:");
  const holes = [cards("Ac", "Kc"), cards("Td", "Tc"), cards("9d", "7h")];

  [1000, 5000, 10000, 50000].forEach((sampleSize) => {
    console.time(`Monte Carlo (${sampleSize})`);
    const result = monteCarloOdds(holes, [], sampleSize);
    console.timeEnd(`Monte Carlo (${sampleSize})`);
  });
};

withProfiling(runPerformanceTest, "monteCarloOdds");
