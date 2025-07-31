# WASM Profiling Setup Guide

## Quick Start

### 1. Build the WASM Module

```bash
cd src/rust
npm install
npm run build
```

### 2. Run Basic Profiling Test

```bash
# Run with Node.js inspector
node --inspect-brk ../../__tests__/full/getBestHandWASM.ts
```

### 3. Connect with Node.js Inspector

1. Use Node.js's built-in inspector (no Chrome required)
2. Use `v8-profiler-next` for CPU profiling (already in dependencies)
3. Run profiling scripts directly from command line

## Detailed Setup Instructions

### Prerequisites

- Node.js v14+ with inspector support
- The WASM module must be built (`npm run build` in `src/rust`)
- `v8-profiler-next` is already included in dependencies

### Step-by-Step Profiling

#### Step 1: Verify WASM Build

```bash
cd src/rust
npm run build
ls -la node/  # Should contain poker_hands.wasm and poker_hands.js
```

#### Step 2: Create Profiling Test Script

```typescript
// profiling-test.ts
import { readFileSync } from "fs";
import { performance } from "perf_hooks";
import { startProfiling, stopProfiling } from "v8-profiler-next";
import { Hand, HandType, Card, Suit, Value } from "./node/poker_hands";

const loadTrainingData = () => {
  const trainingDataRaw = readFileSync(__dirname + "/poker-hand-testing.data");

  const lineSuitToSuit = (lineSuit: string): Suit => {
    if (lineSuit === "1") return "h";
    if (lineSuit === "2") return "s";
    if (lineSuit === "3") return "d";
    if (lineSuit === "4") return "c";
    throw new Error("Invalid suit: " + lineSuit);
  };

  const lineValueToValue = (lineValue: string): Value => {
    if (lineValue === "1") return Value.Ace;
    if (lineValue === "2") return Value.Two;
    if (lineValue === "3") return Value.Three;
    if (lineValue === "4") return Value.Four;
    if (lineValue === "5") return Value.Five;
    if (lineValue === "6") return Value.Six;
    if (lineValue === "7") return Value.Seven;
    if (lineValue === "8") return Value.Eight;
    if (lineValue === "9") return Value.Nine;
    if (lineValue === "10") return Value.Ten;
    if (lineValue === "11") return Value.Jack;
    if (lineValue === "12") return Value.Queen;
    if (lineValue === "13") return Value.King;
    throw new Error("Invalid value: " + lineValue);
  };

  return trainingDataRaw
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
      ].map(([lineSuit, lineValue]) =>
        Card.new(lineSuitToSuit(lineSuit), lineValueToValue(lineValue))
      );

      return { cards };
    })
    .slice(0, 10000); // Limit for profiling
};

const runDetailedProfiling = () => {
  console.log("Loading training data...");
  const trainingData = loadTrainingData();
  console.log(`Loaded ${trainingData.length} training lines.`);

  console.log("Starting detailed profiling...");

  // Start CPU profiling
  const profileName = "wasm-performance-profile";
  startProfiling(profileName);

  // Overall timing
  const overallStart = performance.now();

  // Individual function timing
  const functionTimes = {
    handCreation: 0,
    getBestHand: 0,
    wasmBoundary: 0,
  };

  trainingData.forEach(({ cards }, index) => {
    // Measure Hand.new() timing
    const handStart = performance.now();
    const hand = Hand.new(cards);
    functionTimes.handCreation += performance.now() - handStart;

    // Measure get_best_hand() timing
    const getBestStart = performance.now();
    const result = hand.get_best_hand();
    functionTimes.getBestHand += performance.now() - getBestStart;

    // Measure WASM boundary overhead
    const boundaryStart = performance.now();
    const handType = result.hand_type();
    const cardsResult = result.cards();
    functionTimes.wasmBoundary += performance.now() - boundaryStart;

    if (index % 1000 === 0) {
      console.log(`Processed ${index} hands...`);
    }
  });

  const totalTime = performance.now() - overallStart;

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

  console.log("\n=== Detailed Performance Analysis ===");
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(
    `Hands per second: ${((trainingData.length / totalTime) * 1000).toFixed(0)}`
  );
  console.log("");
  console.log("=== Function Breakdown ===");
  console.log(
    `Hand creation: ${functionTimes.handCreation.toFixed(2)}ms (${(
      (functionTimes.handCreation / totalTime) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `get_best_hand: ${functionTimes.getBestHand.toFixed(2)}ms (${(
      (functionTimes.getBestHand / totalTime) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `WASM boundary: ${functionTimes.wasmBoundary.toFixed(2)}ms (${(
      (functionTimes.wasmBoundary / totalTime) *
      100
    ).toFixed(1)}%)`
  );

  return {
    totalTime,
    functionTimes,
    handsPerSecond: (trainingData.length / totalTime) * 1000,
  };
};

// Run the profiling
runDetailedProfiling();
```

#### Step 3: Execute with Inspector

```bash
node --inspect-brk profiling-test.ts
```

#### Step 4: Analyze the Profile

The profile file (`*.cpuprofile`) can be analyzed using:

**Option A: Node.js CLI Tools**

```bash
# Use Node.js inspector to view the profile
node --inspect profile-viewer.js
```

**Option B: Convert to Readable Format**

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

Look for:

- Functions with high self-time
- WASM boundary calls that might be expensive
- Hotspots in the evaluation chain

### Memory Profiling

#### Step 1: Enable Memory Profiling

```bash
node --expose-gc profiling-test.ts
```

#### Step 2: Memory Analysis Script

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

### Advanced Profiling Techniques

#### 1. Function-Level Timing

```typescript
// Add detailed timing around specific functions
const profileSpecificFunctions = () => {
  const trainingData = loadTrainingData().slice(0, 1000);

  const functions = ["has_flush", "has_straight", "has_pair"];

  functions.forEach((funcName) => {
    const start = performance.now();
    trainingData.forEach(({ cards }) => {
      const hand = Hand.new(cards);
      const func = (hand as any)[funcName];
      if (func) func.call(hand);
    });
    const totalTime = performance.now() - start;
    console.log(
      `${funcName}: ${totalTime.toFixed(2)}ms (${(
        (trainingData.length / totalTime) *
        1000
      ).toFixed(0)} calls/sec)`
    );
  });
};
```

#### 2. WASM Module Loading Time

```typescript
// Measure initialization time
const measureWasmInit = async () => {
  console.log("\n=== WASM Initialization ===");

  const initStart = performance.now();
  const { Hand } = await import("./node/poker_hands");
  const initTime = performance.now() - initStart;

  console.log(`WASM module initialization: ${initTime.toFixed(2)}ms`);

  // Test with a simple operation
  const card = Card.new("h", Value.Ace);
  const hand = Hand.new([card]);
  const testStart = performance.now();
  hand.get_best_hand();
  const testTime = performance.now() - testStart;

  console.log(`First operation time: ${testTime.toFixed(2)}ms`);

  return { initTime, testTime };
};
```

### Expected Findings

Based on the code analysis, you should expect to find:

1. **Hotspots in `get_best_hand()`**: The sorting operation and multiple hand detection calls
2. **WASM boundary overhead**: Each function call across JS-Rust boundary has cost
3. **Memory allocation patterns**: Multiple Vec<Card> clones during evaluation
4. **Algorithmic inefficiencies**: Some detection functions may be suboptimal

### Troubleshooting

#### Common Issues

1. **WASM module not found**

   ```bash
   # Ensure the module is built
   cd src/rust && npm run build
   ```

2. **Inspector not connecting**

   ```bash
   # Try different inspector flags
   node --inspect profiling-test.ts
   # Or
   node --inspect=0.0.0.0:9229 profiling-test.ts
   ```

3. **Memory profiling not working**
   ```bash
   # Enable explicit garbage collection
   node --expose-gc profiling-test.ts
   ```

#### Performance Tips

1. Use smaller sample sizes for initial profiling (1,000-10,000 hands)
2. Run multiple iterations to get stable measurements
3. Close other memory-intensive applications during profiling
4. Use release builds for realistic performance measurements

This setup will provide comprehensive insights into the WASM performance characteristics and help identify the specific bottlenecks causing the 6x performance gap, all without requiring Chrome DevTools.
