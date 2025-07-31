# WASM Performance Profiling Plan

## Overview

This document outlines the comprehensive approach for profiling the Rust/WASM implementation to identify and address the 6x performance gap compared to the TypeScript implementation.

## Current Performance Issue

- **Rust/WASM**: ~1/6th the speed of TypeScript implementation
- **Test**: 1,000,000 poker hand evaluations
- **Focus**: `get_best_hand()` function performance

## Profiling Strategy

### Phase 1: Setup and Baseline

#### 1.1 Build and Verify WASM Module

```bash
# Build the WASM module
cd src/rust
npm run build

# Verify the build output
ls -la node/ web/
```

#### 1.2 Establish Baseline Performance

Create a baseline test that compares both implementations:

```typescript
// Baseline comparison test
const runBaselineComparison = () => {
  const trainingData = loadTrainingData(); // 1M hands

  // TypeScript baseline
  const tsStart = performance.now();
  trainingData.forEach(({ cards }) => {
    getBestHand(cards);
  });
  const tsTime = performance.now() - tsStart;

  // Rust/WASM baseline
  const wasmStart = performance.now();
  trainingData.forEach(({ cards }) => {
    Hand.new(cards).get_best_hand();
  });
  const wasmTime = performance.now() - wasmStart;

  console.log(
    `TypeScript: ${tsTime}ms (${trainingData.length / tsTime} hands/ms)`
  );
  console.log(
    `Rust/WASM: ${wasmTime}ms (${trainingData.length / wasmTime} hands/ms)`
  );
  console.log(`Ratio: ${(wasmTime / tsTime).toFixed(2)}x slower`);
};
```

### Phase 2: Node.js Inspector Profiling

#### 2.1 Enable Node.js Inspector

```bash
# Start the test with inspector enabled
node --inspect-brk __tests__/full/getBestHandWASM.ts
```

#### 2.2 Chrome DevTools Setup

1. Open Chrome DevTools (chrome://inspect)
2. Connect to the Node.js process
3. Use the **Profiler** tab to capture CPU profiles

#### 2.3 Profiling Script with Detailed Timing

```typescript
// Enhanced profiling test
const detailedProfiling = () => {
  const trainingData = loadTrainingData().slice(0, 10000); // Smaller sample for detailed analysis

  console.log("Starting detailed profiling...");

  // Overall timing
  const overallStart = performance.now();

  // Individual function timing
  const functionTimes = {
    handCreation: 0,
    getBestHand: 0,
    wasmBoundary: 0,
  };

  trainingData.forEach(({ cards }) => {
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
  });

  const totalTime = performance.now() - overallStart;

  console.log("=== Detailed Performance Analysis ===");
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
```

### Phase 3: Memory Profiling

#### 3.1 Memory Usage Analysis

```typescript
// Memory profiling script
const memoryProfiling = () => {
  const trainingData = loadTrainingData().slice(0, 10000);

  console.log("=== Memory Profiling ===");

  // Initial memory
  const initialMemory = process.memoryUsage();
  console.log(`Initial RSS: ${(initialMemory.rss / 1024 / 1024).toFixed(2)}MB`);

  // Run test and measure memory growth
  trainingData.forEach(({ cards }) => {
    const hand = Hand.new(cards);
    const result = hand.get_best_hand();
    const handType = result.hand_type();
  });

  const finalMemory = process.memoryUsage();
  console.log(`Final RSS: ${(finalMemory.rss / 1024 / 1024).toFixed(2)}MB`);
  console.log(
    `Memory growth: ${(
      (finalMemory.rss - initialMemory.rss) /
      1024 /
      1024
    ).toFixed(2)}MB`
  );

  // Garbage collection test
  if (global.gc) {
    global.gc();
    const afterGCMemory = process.memoryUsage();
    console.log(`After GC: ${(afterGCMemory.rss / 1024 / 1024).toFixed(2)}MB`);
  }
};
```

#### 3.2 Heap Snapshot Analysis

1. Use Chrome DevTools **Memory** tab
2. Take heap snapshots before and after the test
3. Analyze memory allocation patterns
4. Look for retained objects and memory leaks

### Phase 4: WASM-Specific Analysis

#### 4.1 WASM Module Loading Time

```typescript
// Measure WASM module initialization
const measureWasmInit = async () => {
  const initStart = performance.now();

  // This assumes the WASM module is loaded on demand
  const { Hand } = await import("../../src/rust/node/poker_hands");

  const initTime = performance.now() - initStart;
  console.log(`WASM module initialization: ${initTime.toFixed(2)}ms`);

  return initTime;
};
```

#### 4.2 Function Call Overhead Measurement

```typescript
// Measure individual function call overhead
const measureFunctionOverhead = () => {
  const trainingData = loadTrainingData().slice(0, 1000);

  console.log("=== Function Call Overhead Analysis ===");

  // Measure individual hand detection functions
  const functionsToTest = [
    "has_flush",
    "has_straight",
    "has_pair",
    "has_three_of_a_kind",
    "has_four_of_a_kind",
    "has_full_house",
    "has_two_pair",
  ];

  functionsToTest.forEach((funcName) => {
    const start = performance.now();
    trainingData.forEach(({ cards }) => {
      const hand = Hand.new(cards);
      // Dynamically call the function
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

### Phase 5: Algorithmic Comparison

#### 5.1 Detailed Algorithm Analysis

Compare the key algorithms between implementations:

| Algorithm              | TypeScript Approach                 | Rust Approach                      | Potential Issues                        |
| ---------------------- | ----------------------------------- | ---------------------------------- | --------------------------------------- |
| **Flush Detection**    | Pre-suits array, simple counting    | HashMap with dynamic counting      | HashMap overhead, no pre-sorting        |
| **Straight Detection** | Pre-values, contiguous subset check | HashSet + sorting, multiple passes | Multiple iterations, sorting overhead   |
| **Hand Evaluation**    | Pre-sorted data, early termination  | Sort on each call, full evaluation | Redundant sorting, no early termination |
| **Memory Usage**       | Object references, minimal copying  | Vec cloning, multiple allocations  | Excessive copying, GC pressure          |

### Phase 6: Optimization Recommendations

Based on profiling results, expect to identify:

#### 6.1 High-Priority Optimizations

1. **Pre-sort cards once** instead of on each function call
2. **Reduce WASM boundary calls** by batching operations
3. **Implement caching** for repeated hand evaluations
4. **Optimize data structures** (arrays instead of HashMaps where possible)

#### 6.2 Medium-Priority Optimizations

1. **Memory pool allocation** for card objects
2. **Algorithmic improvements** for hand detection
3. **Lazy evaluation** of non-critical properties
4. **WebAssembly optimizations** (LTO, SIMD where applicable)

#### 6.3 Low-Priority Optimizations

1. **Inline caching** for frequent operations
2. **Profile-guided optimization** (PGO)
3. **Thread pooling** for batch operations
4. **Advanced memory management** techniques

## Expected Deliverables

1. **Performance Baseline**: Quantitative comparison of current performance
2. **CPU Profiles**: Flamegraphs showing hotspots
3. **Memory Analysis**: Heap snapshots and allocation patterns
4. **Bottleneck Report**: Specific functions and operations causing slowdowns
5. **Optimization Roadmap**: Prioritized list of improvements with expected impact
6. **Implementation Guide**: Specific code changes needed for each optimization

## Next Steps

1. **Set up the profiling environment** and run baseline tests
2. **Collect detailed profiles** using Node.js inspector
3. **Analyze the results** to identify specific bottlenecks
4. **Create optimization plan** with estimated performance improvements
5. **Implement and validate** the optimizations

## Tools and Dependencies

- **Node.js Inspector**: Built-in profiling capabilities
- **Chrome DevTools**: For CPU and memory analysis
- **Performance API**: High-resolution timing measurements
- **Memory Usage API**: Track memory consumption
- **Custom timing utilities**: Detailed function-level profiling

This comprehensive profiling approach will provide the detailed insights needed to understand and address the performance gap between the TypeScript and Rust/WASM implementations.
