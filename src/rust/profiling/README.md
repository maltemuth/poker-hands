# Rust/WASM Performance Profiling

## Overview

This directory contains comprehensive profiling tools and analysis for identifying and addressing the performance gap between the TypeScript and Rust/WASM implementations of the poker-hands library.

## Current Issue

The Rust/WASM implementation is currently performing at approximately **1/6th the speed** of the TypeScript implementation when evaluating poker hands.

## Profiling Strategy

We've developed a multi-phase approach to identify and resolve performance bottlenecks:

### Phase 1: Baseline Establishment

- [x] Build the WASM module
- [ ] Create baseline performance comparison
- [ ] Quantify the exact performance gap

### Phase 2: Profiling Execution

- [ ] Run Node.js inspector profiling
- [ ] Generate CPU profiles using `v8-profiler-next`
- [ ] Analyze memory allocation patterns
- [ ] Profile specific functions (`get_best_hand`, hand detection functions)

### Phase 3: Analysis & Optimization

- [ ] Identify specific bottlenecks from profiling data
- [ ] Compare algorithmic approaches between implementations
- [ ] Develop targeted optimization strategies
- [ ] Implement and validate improvements

## Available Tools

### 1. Profiling Scripts

- `performance-comparison.ts` - Compare TypeScript vs Rust/WASM performance
- `profiling-script.ts` - Generate CPU profiles using v8-profiler-next
- `memory-profiling.ts` - Analyze memory usage patterns

### 2. Analysis Documents

- `wasm-profiling-plan.md` - Comprehensive profiling strategy
- `nodejs-inspector-guide.md` - Node.js inspector setup and usage
- `performance-analysis.md` - Detailed bottleneck analysis
- `setup-guide.md` - Step-by-step profiling setup

### 3. Expected Findings

Based on code analysis, we expect to identify these bottlenecks:

#### High-Priority Issues

1. **Redundant sorting** - Rust implementation sorts cards on every call
2. **HashMap overhead** - Using HashMap instead of simple arrays for counting
3. **WASM boundary calls** - Multiple small function calls across JS-Rust boundary
4. **Memory cloning** - Excessive Vec<Card> allocations

#### Medium-Priority Issues

1. **Algorithmic differences** - Less efficient hand detection algorithms
2. **Lack of early termination** - Full evaluation when early exit is possible
3. **No pre-computation** - Missing pre-sorted data optimization

## Quick Start

### 1. Build the WASM Module

```bash
cd src/rust
npm install
npm run build
```

### 2. Run Performance Comparison

```bash
node performance-comparison.ts
```

### 3. Generate CPU Profile

```bash
node profiling-script.ts
```

### 4. Analyze Memory Usage

```bash
node memory-profiling.ts
```

## Expected Outcomes

### Performance Improvements

| Optimization Phase     | Expected Speedup | Implementation Time |
| ---------------------- | ---------------- | ------------------- |
| Current Baseline       | 1x               | -                   |
| Quick Wins             | 2-3x             | 1-2 days            |
| Medium Optimizations   | 1.5-2x           | 3-5 days            |
| Advanced Optimizations | 1.2-1.5x         | 5-7 days            |
| **Total Expected**     | **3-9x**         | **1-2 weeks**       |

### Key Deliverables

1. **Baseline metrics** - Quantified performance gap
2. **CPU profiles** - Hotspot identification
3. **Memory analysis** - Allocation patterns and leaks
4. **Bottleneck report** - Specific functions causing slowdowns
5. **Optimization plan** - Prioritized improvements with expected impact
6. **Implementation guide** - Code changes for each optimization

## Implementation Roadmap

### Week 1: Quick Wins

- [ ] Pre-compute sorted data in Hand struct
- [ ] Replace HashMap with arrays for suit counting
- [ ] Add early termination in hand evaluation
- [ ] Reduce WASM boundary calls by batching

### Week 2: Medium Optimizations

- [ ] Implement memory pooling for card objects
- [ ] Optimize straight detection algorithm
- [ ] Add caching for repeated evaluations
- [ ] Improve data structure efficiency

### Week 3: Advanced Optimizations

- [ ] WebAssembly optimizations (LTO, SIMD)
- [ ] Profile-guided optimization
- [ ] Advanced caching strategies
- [ ] Performance regression testing

## Validation Strategy

### Metrics to Track

- **Hands per second** - Primary performance metric
- **Memory usage per evaluation** - Memory efficiency
- **WASM initialization time** - Module loading overhead
- **Function call overhead** - WASM boundary cost
- **Garbage collection frequency** - Memory management impact

### Testing Approach

1. **Micro-benchmarks** - Individual function performance
2. **Integration benchmarks** - Full hand evaluation pipeline
3. **Memory profiling** - Allocation patterns and leaks
4. **Regression testing** - Ensure correctness is maintained

## Troubleshooting

### Common Issues

1. **WASM module not found**

   ```bash
   cd src/rust && npm run build
   ```

2. **Memory profiling not working**

   ```bash
   node --expose-gc memory-profiling.ts
   ```

3. **Inspector not connecting**
   ```bash
   node --inspect profiling-script.ts
   ```

### Performance Tips

- Use smaller sample sizes for initial profiling (1,000-10,000 hands)
- Run multiple iterations for stable measurements
- Close other memory-intensive applications during profiling
- Use release builds for realistic performance measurements

## Next Steps

### Immediate Actions

1. **Run the baseline comparison** to confirm the 6x performance gap
2. **Generate CPU profiles** to identify hotspots
3. **Analyze memory usage** to find allocation patterns
4. **Document findings** in the performance analysis

### Medium-term Goals

1. **Implement quick wins** optimizations
2. **Validate improvements** with performance benchmarks
3. **Iterate on medium-priority** optimizations
4. **Create comprehensive test suite** for performance regression

### Long-term Vision

1. **Achieve parity or exceed** TypeScript performance
2. **Establish performance monitoring** in CI/CD
3. **Create performance benchmarks** for future changes
4. **Document best practices** for WASM optimization

## Conclusion

The Rust/WASM performance gap is primarily due to algorithmic inefficiencies and WASM boundary overhead. With systematic profiling and targeted optimizations, we can achieve significant performance improvements, potentially bringing the Rust/WASM implementation to 3-9x the current performance.

This comprehensive approach ensures that optimizations are based on actual profiling data and maintain code correctness while delivering substantial performance gains.
