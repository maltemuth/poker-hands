# Node.js Inspector Profiling Guide

## Why Node.js Inspector?

For profiling the Rust/WASM implementation in Node.js, we can use Node.js's built-in inspector without needing Chrome DevTools. This is more appropriate because:

1. **Direct Node.js integration**: Native profiling capabilities
2. **No browser dependency**: Works in headless environments
3. **WASM-specific insights**: Better visibility into WASM module performance
4. **Command-line friendly**: Can be automated in CI/CD pipelines

## Node.js Inspector Setup

### 1. Basic Profiling with Node.js Inspector

```bash
# Start the test with inspector enabled
node --inspect-brk __tests__/full/getBestHandWASM.ts
```

### 2. Connect with Node.js CLI Tools

Instead of Chrome, use the built-in Node.js inspector:

```bash
# Generate CPU profile programmatically
node -e "
const inspector = require('inspector');
const fs = require('fs');
const session = new inspector.Session();
session.connect();

// Start CPU profiling
session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Run your test here
    require('./__tests__/full/getBestHandWASM.ts');

    // Stop profiling and save
    session.post('Profiler.stop', (err, { profile }) => {
      fs.writeFileSync('wasm-profile.cpuprofile', JSON.stringify(profile));
      console.log('Profile saved to wasm-profile.cpuprofile');
      session.disconnect();
    });
  });
});
"
```

### 3. Alternative: Using `v8-profiler-next`

Since the project already has `v8-profiler-next` as a dependency, we can use it directly:

```typescript
// profiling-script.ts
import { startProfiling, stopProfiling } from "v8-profiler-next";
import { readFileSync } from "fs";
import {
  Hand,
  HandType,
  Card,
  Suit,
  Value,
} from "../src/rust/node/poker_hands";

const runProfiling = () => {
  console.log("Starting profiling...");

  // Start profiling
  const profileName = "wasm-performance-profile";
  startProfiling(profileName);

  // Load test data
  const trainingDataRaw = readFileSync(__dirname + "/poker-hand-testing.data");
  const trainingLines = trainingDataRaw
    .toString()
    .split("\r\n")
    .map((line) => line.split(","))
    .map((line) => {
      const [
        suitOne,
        valueOne,
        suitTwo,
        valueTwo,
        suitThree,
        valueThree,
        suitFour,
        valueFour,
        suitFive,
        valueFive,
      ] = line;

      const cards = [
        [suitOne, valueOne],
        [suitTwo, valueTwo],
        [suitThree, valueThree],
        [suitFour, valueFour],
        [suitFive, valueFive],
      ].map(([lineSuit, lineValue]) => {
        const suit =
          lineSuit === "1"
            ? "h"
            : lineSuit === "2"
            ? "s"
            : lineSuit === "3"
            ? "d"
            : "c";
        const value =
          parseInt(lineValue) === 1
            ? Value.Ace
            : parseInt(lineValue) === 2
            ? Value.Two
            : parseInt(lineValue) === 3
            ? Value.Three
            : parseInt(lineValue) === 4
            ? Value.Four
            : parseInt(lineValue) === 5
            ? Value.Five
            : parseInt(lineValue) === 6
            ? Value.Six
            : parseInt(lineValue) === 7
            ? Value.Seven
            : parseInt(lineValue) === 8
            ? Value.Eight
            : parseInt(lineValue) === 9
            ? Value.Nine
            : parseInt(lineValue) === 10
            ? Value.Ten
            : parseInt(lineValue) === 11
            ? Value.Jack
            : parseInt(lineValue) === 12
            ? Value.Queen
            : Value.King;

        return Card.new(suit, value);
      });

      return { cards };
    })
    .slice(0, 10000); // Limit for profiling

  console.log(`Loaded ${trainingLines.length} training lines.`);

  // Run the test
  const before = Date.now().valueOf();

  trainingLines.forEach(({ cards }) => {
    Hand.new(cards).get_best_hand();
  });

  const elapsed = Date.now().valueOf() - before;
  console.log(
    `${trainingLines.length} hands / ${elapsed} ms / ${
      trainingLines.length / elapsed
    } hands/ms`
  );

  // Stop profiling and save
  const profile = stopProfiling(profileName);
  profile.export((error, result) => {
    if (error) {
      console.error("Error exporting profile:", error);
      return;
    }

    // Save the profile
    require("fs").writeFileSync(
      __dirname + `/wasm-performance-${Date.now()}.cpuprofile`,
      result
    );
    console.log(`Profile saved to wasm-performance-${Date.now()}.cpuprofile`);
    profile.delete();
  });
};

runProfiling();
```

### 4. Running the Profiling Script

```bash
# Run the profiling script
node profiling-script.ts
```

### 5. Analyzing the Profile

The profile file (`*.cpuprofile`) can be analyzed using:

#### Option A: Node.js CLI Tools

```bash
# Use Node.js inspector to view the profile
node --inspect profile-viewer.js
```

#### Option B: Convert to Readable Format

```typescript
// profile-analyzer.ts
const fs = require("fs");
const profile = JSON.parse(
  fs.readFileSync("wasm-performance.cpuprofile", "utf8")
);

// Analyze the profile
function analyzeProfile(profile) {
  const nodes = profile.nodes;
  const functionMap = new Map();

  // Build function name map
  profile.deopt.forEach((deopt) => {
    functionMap.set(deopt.scriptId, deopt.scriptName);
  });

  // Calculate total time by function
  const functionTimes = new Map();

  nodes.forEach((node) => {
    if (node.callFrame && node.callFrame.functionName) {
      const funcName = node.callFrame.functionName;
      const selfTime = node.hitCount * node.selfTime;

      functionTimes.set(
        funcName,
        (functionTimes.get(funcName) || 0) + selfTime
      );
    }
  });

  // Sort by time spent
  const sortedFunctions = Array.from(functionTimes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log("Top 10 functions by self time:");
  sortedFunctions.forEach(([func, time]) => {
    console.log(`${func}: ${time.toFixed(2)}ms`);
  });
}

analyzeProfile(profile);
```

### 6. Memory Profiling with Node.js

```typescript
// memory-profiling.ts
import { writeFileSync } from "fs";
import { performance } from "perf_hooks";

const runMemoryProfiling = () => {
  console.log("Starting memory profiling...");

  // Initial memory measurement
  const initialMemory = process.memoryUsage();
  console.log(`Initial RSS: ${(initialMemory.rss / 1024 / 1024).toFixed(2)}MB`);
  console.log(
    `Initial Heap Used: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`
  );

  // Load test data
  const trainingDataRaw = require("fs").readFileSync(
    __dirname + "/poker-hand-testing.data"
  );
  const trainingLines = trainingDataRaw
    .toString()
    .split("\r\n")
    .map((line) => line.split(","))
    .map((line) => {
      const [
        suitOne,
        valueOne,
        suitTwo,
        valueTwo,
        suitThree,
        valueThree,
        suitFour,
        valueFour,
        suitFive,
        valueFive,
      ] = line;

      const cards = [
        [suitOne, valueOne],
        [suitTwo, valueTwo],
        [suitThree, valueThree],
        [suitFour, valueFour],
        [suitFive, valueFive],
      ].map(([lineSuit, lineValue]) => {
        const suit =
          lineSuit === "1"
            ? "h"
            : lineSuit === "2"
            ? "s"
            : lineSuit === "3"
            ? "d"
            : "c";
        const value =
          parseInt(lineValue) === 1
            ? Value.Ace
            : parseInt(lineValue) === 2
            ? Value.Two
            : // ... rest of mapping
            parseInt(lineValue) === 13
            ? Value.King
            : Value.Two;

        return Card.new(suit, value);
      });

      return { cards };
    })
    .slice(0, 5000); // Smaller sample for memory analysis

  console.log(`Loaded ${trainingLines.length} training lines.`);

  // Run test and measure memory
  const memoryMeasurements = [];

  trainingLines.forEach(({ cards }, index) => {
    const hand = Hand.new(cards);
    const result = hand.get_best_hand();

    if (index % 1000 === 0) {
      const memory = process.memoryUsage();
      memoryMeasurements.push({
        iteration: index,
        rss: memory.rss,
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal,
        external: memory.external,
      });

      console.log(
        `Iteration ${index}: RSS=${(memory.rss / 1024 / 1024).toFixed(2)}MB, ` +
          `Heap=${(memory.heapUsed / 1024 / 1024).toFixed(2)}MB`
      );
    }
  });

  // Final memory measurement
  const finalMemory = process.memoryUsage();
  console.log(`\nFinal RSS: ${(finalMemory.rss / 1024 / 1024).toFixed(2)}MB`);
  console.log(
    `Final Heap Used: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`
  );
  console.log(
    `Memory growth: ${(
      (finalMemory.rss - initialMemory.rss) /
      1024 /
      1024
    ).toFixed(2)}MB`
  );

  // Save memory measurements
  writeFileSync(
    __dirname + "/memory-measurements.json",
    JSON.stringify(memoryMeasurements, null, 2)
  );
  console.log("Memory measurements saved to memory-measurements.json");

  return {
    initialMemory,
    finalMemory,
    memoryGrowth: finalMemory.rss - initialMemory.rss,
    measurements: memoryMeasurements,
  };
};

runMemoryProfiling();
```

### 7. Performance Comparison Script

```typescript
// performance-comparison.ts
import { performance } from "perf_hooks";
import getBestHand from "../../src/model/hand/getBestHand";
import {
  Hand,
  HandType,
  Card,
  Suit,
  Value,
} from "../../src/rust/node/poker_hands";

const runComparison = () => {
  console.log("Loading test data...");

  // Load test data (same for both implementations)
  const trainingDataRaw = require("fs").readFileSync(
    __dirname + "/poker-hand-testing.data"
  );
  const trainingLines = trainingDataRaw
    .toString()
    .split("\r\n")
    .map((line) => line.split(","))
    .map((line) => {
      const [
        suitOne,
        valueOne,
        suitTwo,
        valueTwo,
        suitThree,
        valueThree,
        suitFour,
        valueFour,
        suitFive,
        valueFive,
      ] = line;

      const cards = [
        [suitOne, valueOne],
        [suitTwo, valueTwo],
        [suitThree, valueThree],
        [suitFour, valueFour],
        [suitFive, valueFive],
      ].map(([lineSuit, lineValue]) => {
        const suit =
          lineSuit === "1"
            ? "h"
            : lineSuit === "2"
            ? "s"
            : lineSuit === "3"
            ? "d"
            : "c";
        const value =
          parseInt(lineValue) === 1
            ? Value.Ace
            : parseInt(lineValue) === 2
            ? Value.Two
            : // ... rest of mapping
            parseInt(lineValue) === 13
            ? Value.King
            : Value.Two;

        return { suit, value };
      });

      return { cards };
    })
    .slice(0, 10000); // Limit for reasonable test time

  console.log(`Loaded ${trainingLines.length} training lines.`);

  // TypeScript implementation
  console.log("\n=== TypeScript Implementation ===");
  const tsStart = performance.now();
  trainingLines.forEach(({ cards }) => {
    getBestHand(cards);
  });
  const tsTime = performance.now() - tsStart;
  console.log(
    `TypeScript: ${tsTime.toFixed(2)}ms (${(
      (trainingLines.length / tsTime) *
      1000
    ).toFixed(0)} hands/sec)`
  );

  // Rust/WASM implementation
  console.log("\n=== Rust/WASM Implementation ===");
  const wasmStart = performance.now();
  trainingLines.forEach(({ cards }) => {
    const wasmCards = cards.map((card) => Card.new(card.suit, card.value));
    Hand.new(wasmCards).get_best_hand();
  });
  const wasmTime = performance.now() - wasmStart;
  console.log(
    `Rust/WASM: ${wasmTime.toFixed(2)}ms (${(
      (trainingLines.length / wasmTime) *
      1000
    ).toFixed(0)} hands/sec)`
  );

  // Comparison
  const ratio = wasmTime / tsTime;
  console.log(`\n=== Performance Comparison ===`);
  console.log(`Rust/WASM is ${ratio.toFixed(2)}x slower than TypeScript`);
  console.log(`Performance gap: ${((ratio - 1) * 100).toFixed(1)}%`);

  return {
    tsTime,
    wasmTime,
    ratio,
    handsPerSecond: {
      ts: (trainingLines.length / tsTime) * 1000,
      wasm: (trainingLines.length / wasmTime) * 1000,
    },
  };
};

runComparison();
```

### 8. Running the Comparison

```bash
# Run performance comparison
node performance-comparison.ts
```

## Node.js Inspector Benefits

1. **No Chrome dependency**: Works in headless environments
2. **Better WASM visibility**: Native Node.js integration
3. **Programmatic access**: Can be automated and scripted
4. **CLI-friendly**: Easy integration with CI/CD pipelines
5. **Memory profiling**: Built-in memory usage tracking

## Next Steps

1. **Run the baseline comparison** to confirm the 6x performance gap
2. **Generate CPU profiles** using `v8-profiler-next`
3. **Analyze memory usage** patterns during execution
4. **Identify specific bottlenecks** from the profiling data
5. **Implement targeted optimizations** based on the findings

This approach provides comprehensive profiling capabilities without requiring Chrome DevTools, making it more suitable for server-side and automated profiling scenarios.
