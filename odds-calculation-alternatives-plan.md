# Poker Odds Calculation Alternatives Plan

## Current Implementation Analysis

### Current Approach

The current implementation in `src/model/odds/odds.ts` uses an **exhaustive enumeration** approach:

1. **Generate all possible remaining boards**: Uses `combinations()` to generate all possible 5-card boards from remaining cards
2. **Evaluate each board**: For each possible board, evaluates all hole cards to determine the best hand
3. **Compare hands**: Uses `isBetterThan()` and `hasEqualValue()` to determine winners and ties
4. **Calculate statistics**: Aggregates results across all possible board combinations

### Performance Bottlenecks

1. **Combinatorial Explosion**:

   - With 47 unknown cards, there are C(47,5) = 1,533,939 possible boards
   - Each board requires evaluating all hole cards and comparing hands
   - This results in millions of hand evaluations

2. **Redundant Calculations**:

   - `getBestHand()` is called repeatedly for similar card combinations
   - Hand comparisons could be optimized with memoization

3. **Memory Usage**:
   - Storing all possible board combinations consumes significant memory
   - The current implementation processes boards sequentially but still generates all combinations upfront

### Computational Complexity

- **Time Complexity**: O(C(n,5) × h × b) where n is remaining cards, h is number of holes, b is hand evaluation complexity
- **Space Complexity**: O(C(n,5)) for storing all combinations

## Alternative Approaches

### 1. Monte Carlo Simulation

**Concept**: Instead of enumerating all possibilities, randomly sample a subset of possible boards and use statistical sampling to estimate odds.

**Advantages**:

- **Performance**: O(s × h × b) where s is sample size (typically 10,000-100,000 vs 1.5M+)
- **Memory**: O(1) - no need to store all combinations
- **Scalability**: Can trade accuracy for performance by adjusting sample size
- **Parallelizable**: Easy to distribute across multiple threads/cores

**Disadvantages**:

- **Statistical Uncertainty**: Results are estimates with confidence intervals
- **Random Variability**: Different runs may produce slightly different results
- **Sample Size Dependency**: Accuracy depends on chosen sample size

**Implementation**:

```typescript
const monteCarloOdds = (
  holes: Hole[],
  board: Card[] = [],
  sampleSize: number = 10000
): HoleOdds[] => {
  // Sample random boards instead of generating all combinations
  // Use statistical methods to estimate win/tie probabilities
  // Implement confidence intervals for accuracy metrics
};
```

**Expected Performance**: 10-50x faster than current implementation

### 2. Mathematical Approximation

**Concept**: Use mathematical models and pre-computed lookup tables to estimate odds without full simulation.

**Advantages**:

- **Performance**: O(1) or O(h) - constant time for lookup
- **Memory**: O(1) - minimal memory usage
- **Deterministic**: Same input always produces same output
- **Instant Results**: No computation time needed

**Disadvantages**:

- **Approximation Accuracy**: May not capture all poker nuances
- **Limited Scenarios**: Best for common matchups, less accurate for unusual situations
- **Pre-computation Overhead**: Requires building and maintaining lookup tables

**Implementation**:

```typescript
const approximateOdds = (holes: Hole[], board: Card[] = []): HoleOdds[] => {
  // Use hand strength rankings and equity calculations
  // Implement lookup tables for common scenarios
  // Apply mathematical formulas for specific hand matchups
};
```

**Expected Performance**: 1000x+ faster than current implementation

### 3. Hybrid Approach

**Concept**: Combine exhaustive enumeration for small scenarios with Monte Carlo for larger ones, using mathematical approximations for very large scenarios.

**Advantages**:

- **Adaptive Performance**: Automatically chooses best method based on input size
- **Accuracy Control**: Maintains accuracy where needed while optimizing performance
- **Flexibility**: Can be tuned for different use cases
- **Best of All Worlds**: Exact results when possible, optimized otherwise

**Disadvantages**:

- **Implementation Complexity**: More complex to implement and maintain
- **Algorithm Selection Logic**: Requires careful tuning of thresholds
- **Testing Overhead**: More test cases needed for different scenarios

**Implementation**:

```typescript
const adaptiveOdds = (
  holes: Hole[],
  board: Card[] = [],
  options: OddsOptions = {}
): HoleOdds[] => {
  // Choose algorithm based on remaining cards and performance requirements
  // Use exhaustive for small n (< 20 remaining cards)
  // Use Monte Carlo for medium n (20-40 remaining cards)
  // Use approximation for large n (> 40 remaining cards)
};
```

**Expected Performance**: Variable based on selected method

### 4. Optimized Exhaustive Enumeration

**Concept**: Keep the exhaustive approach but optimize the implementation significantly.

**Advantages**:

- **Accuracy**: Maintains exact results (no sampling error)
- **Predictable Performance**: Deterministic runtime
- **No Sampling Error**: No statistical uncertainty
- **Familiar Algorithm**: Same approach, just faster

**Disadvantages**:

- **Still Computationally Expensive**: Will always be slower than sampling methods
- **Memory Intensive**: Still generates all combinations
- **Limited Improvement**: There's a practical limit to optimization

**Implementation**:

```typescript
const optimizedOdds = (holes: Hole[], board: Card[] = []): HoleOdds[] => {
  // Implement memoization for hand evaluations
  // Use bit representations for faster card operations
  // Optimize hand comparison algorithms
  // Implement early termination when possible
};
```

**Expected Performance**: 2-5x faster than current implementation

## Recommended Implementation Strategy

### Phase 1: Monte Carlo Simulation (Priority: High)

**Timeline**: 1-2 days
**Goals**:

- Implement basic Monte Carlo simulation
- Match existing API for backward compatibility
- Add configurable sample size parameter
- Implement statistical confidence intervals

**Tasks**:

1. Implement random board sampling
2. Add statistical aggregation logic
3. Add sample size configuration
4. Add confidence interval calculation
5. Write comprehensive tests
6. Performance benchmarking

### Phase 2: Optimized Exhaustive Enumeration (Priority: Medium)

**Timeline**: 2-3 days
**Goals**:

- Optimize current implementation without changing algorithm
- Maintain exact results while improving performance
- Add memoization and caching

**Tasks**:

1. Implement hand evaluation memoization
2. Optimize card representation (bit operations)
3. Optimize hand comparison algorithms
4. Add early termination logic
5. Performance optimization testing

### Phase 3: Mathematical Approximation (Priority: Medium)

**Timeline**: 3-4 days
**Goals**:

- Implement lookup tables for common scenarios
- Create mathematical models for hand strength
- Add fallback to other methods for edge cases

**Tasks**:

1. Research and implement poker equity formulas
2. Create lookup tables for common preflop matchups
3. Implement hand strength calculation algorithms
4. Add accuracy validation against known results
5. Integration with other methods

### Phase 4: Hybrid Approach (Priority: Low)

**Timeline**: 4-5 days
**Goals**:

- Create intelligent algorithm selection system
- Add user-configurable accuracy/performance options
- Implement automatic method switching

**Tasks**:

1. Design algorithm selection logic
2. Implement adaptive thresholds
3. Add configuration options
4. Create comprehensive testing suite
5. Performance and accuracy validation

## Migration Strategy

### Step 1: Parallel Implementation

- Keep existing `odds()` function unchanged
- Add new functions with suffixes (e.g., `oddsMonteCarlo()`, `oddsOptimized()`)
- Allow users to choose which implementation to use

### Step 2: Performance Testing

- Create comprehensive benchmarks
- Compare accuracy and performance across all methods
- Document trade-offs and recommendations

### Step 3: Gradual Migration

- Update internal functions to use optimized implementations
- Add deprecation notices for old functions
- Provide migration guides

### Step 4: Final Integration

- Create unified `odds()` function with options parameter
- Remove deprecated functions
- Update documentation

## Testing Strategy

### Unit Testing

- Test each algorithm independently
- Validate statistical significance of Monte Carlo results
- Verify mathematical approximations against known values

### Integration Testing

- Test all methods produce consistent results (within expected tolerances)
- Test edge cases and boundary conditions
- Test performance with various input sizes

### Performance Testing

- Benchmark all implementations
- Measure memory usage
- Test scalability with increasing input sizes

### Accuracy Testing

- Compare against known poker odds calculators
- Validate statistical confidence intervals
- Test with extreme scenarios

## Risk Assessment

### Low Risk

- Optimized exhaustive enumeration (maintains same algorithm)
- Monte Carlo simulation (well-established statistical method)

### Medium Risk

- Mathematical approximation (may have accuracy edge cases)
- Performance optimizations (may introduce bugs)

### High Risk

- Hybrid approach (complex integration)
- Breaking changes to API

## Success Metrics

### Performance Metrics

- 10x+ improvement in calculation speed
- Reduced memory usage
- Better scalability with input size

### Accuracy Metrics

- Monte Carlo: < 1% error margin with 95% confidence
- Mathematical approximation: < 5% error for common scenarios
- All methods: exact results where applicable

### User Experience

- Same API for backward compatibility
- Configurable accuracy/performance trade-offs
- Clear documentation of method differences
