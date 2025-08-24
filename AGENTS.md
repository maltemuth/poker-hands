# AGENTS.md - Coding Agent Guidelines for Poker Hands Library

## Node.js Version Requirements

This project requires Node.js v24.6.0 as specified in the `.nvmrc` file. IMPORTANT: Always run `nvm use` with any npm or node command to ensure you're using the correct Node.js version:

```bash
# Run npm commands with nvm use to ensure correct Node.js version
nvm use && npm <command>

# Run node commands with nvm use to ensure correct Node.js version
nvm use && node <script>

# If you don't have the version installed:
nvm install && npm <command>
nvm install && node <script>
```

## Project Overview

This is a TypeScript monorepo for poker-related applications, consisting of three main packages:

- **`packages/library/`**: Core poker library (`@malte.muth/poker-hands`) for hand evaluation, odds calculation, and card manipulation
- **`packages/cli/`**: Command-line interface for using the poker library
- **`packages/service/`**: Service package for poker-related web services

### Key Features

- **Hand Evaluation**: Determine the best possible poker hand from a set of cards
- **Odds Calculation**: Calculate winning probabilities for given hole cards and board
- **Card Manipulation**: Create, shuffle, and manipulate poker decks and cards
- **Hand Comparison**: Compare poker hands to determine which is better
- **Performance**: Optimized for performance with caching and efficient algorithms

## Project Structure

Do not attempt to read **packages/library/**tests**/full/poker-hand-testing.data** as it is too large. If you want understand the file, look at **packages/library/**tests**/full/getBestHand.ts**.

```
packages/
├── library/                 # Core poker library package
│   ├── src/                # Source code
│   │   ├── index.ts        # Main entry point with all exports
│   │   ├── lib/            # Utility functions
│   │   │   ├── numericalSort.ts     # Numerical sorting utility
│   │   │   └── purify.ts           # Memoization utility
│   │   └── model/          # Core business logic
│   │       ├── card/       # Card-related functionality
│   │       │   ├── Card.ts         # Card interface and enums
│   │       │   ├── cards.ts        # Create cards from strings
│   │       │   ├── fromString.ts   # Parse card from string
│   │       │   ├── toString.ts     # Convert card to string
│   │       │   ├── valueCounts.ts  # Count card values
│   │       │   └── ...             # Other card utilities
│   │       ├── hand/       # Hand evaluation logic
│   │       │   ├── getBestHand.ts  # Main hand evaluation
│   │       │   ├── detect/         # Hand detection functions
│   │       │   ├── get/            # Hand creation functions
│   │       │   └── ...             # Other hand utilities
│   │       ├── deck/       # Deck manipulation
│   │       │   ├── create.ts       # Create full deck
│   │       │   └── shuffle.ts      # Shuffle deck
│   │       ├── combinatorics/      # Mathematical utilities
│   │       │   └── combinations.ts # Calculate combinations
│   │       └── odds/       # Odds calculation
│   │           ├── odds.ts         # Main odds calculation
│   │           └── percentages.ts  # Hand percentage calculation
│   ├── __tests__/          # Test files
│   │   ├── unit/           # Unit tests
│   │   ├── full/           # Integration tests
│   │   └── async/          # Async tests
│   └── __perf__/           # Performance tests
├── cli/                    # Command-line interface package
│   ├── src/                # Source code
│   │   ├── index.ts        # Main entry point
│   │   ├── commands/       # CLI commands
│   │   ├── types/          # Type definitions
│   │   └── utils/          # Utility functions
│   └── package.json        # Package configuration
└── service/                # Service package
    ├── src/                # Source code
    │   ├── routes/         # API routes
    │   ├── middleware/     # Express middleware
    │   ├── types/          # Type definitions
    │   ├── utils/          # Utility functions
    │   └── db/             # Database configuration
    ├── __tests__/          # Test files
    │   ├── unit/           # Unit tests
    │   └── integration/    # Integration tests
    └── data/               # Data files
```

## Core API

### Main Functions (from index.ts)

- `getBestHand(cards: Card[]): HandInterface | null` - Get the best possible hand from cards
- `hasEqualValue(a: Hand, b: Hand): boolean` - Check if two hands have equal value
- `isBetterThan(a: Hand, b: Hand): boolean` - Compare two hands
- `odds(holes: Card[][], board: Card[] = []): HoleOdds[]` - Calculate winning odds
- `percentages(hole: Card[], board: Card[] = []): HandPercentages` - Calculate hand type percentages
- `cards(...inputs: string[]): Card[]` - Create cards from strings
- `create(): Card[]` - Create a full poker deck
- `shuffle(items: Card[]): Card[]` - Shuffle cards

### Card Representation

- **Card Interface**: `{ suit: Suit; value: Value }`
- **Suits**: `hearts`, `diamonds`, `clubs`, `spades` (h, d, c, s)
- **Values**: `two` through `ace` (2-14, with J=11, Q=12, K=13, A=14)
- **String Format**: `"2h"`, `"Td"`, `"As"` (value + suit)

### Hand Types (in order of rank, ascending)

1. **HighCard** - Highest card wins
2. **Pair** - Two cards of same value
3. **TwoPair** - Two different pairs
4. **ThreeOfAKind** - Three cards of same value
5. **Straight** - Five consecutive values
6. **Flush** - Five cards of same suit
7. **FullHouse** - Three of a kind + pair
8. **FourOfAKind** - Four cards of same value
9. **StraightFlush** - Straight + flush
10. **RoyalFlush** - Ace-high straight flush

## Coding Patterns and Conventions

### 1. Functional Programming Style

- **Pure Functions**: Most functions are pure (no side effects)
- **Immutability**: Data is not modified in place
- **Composition**: Functions are composed to build complex logic

### 2. TypeScript Best Practices

- **Strong Typing**: Extensive use of interfaces and enums
- **Generic Types**: Used for reusable components (e.g., `combinations<T>`)
- **Type Guards**: Proper type checking and narrowing
- **Union Types**: For flexible but type-safe APIs

### 3. Error Handling

- **Throw Errors**: Invalid inputs throw descriptive errors
- **Early Validation**: Validate inputs before processing
- **Clear Error Messages**: Specific error messages for different failure cases

### 4. Performance Optimizations

- **Memoization**: `purify` utility for caching expensive calculations
- **Pre-sorting**: Cards are pre-sorted when possible to avoid repeated sorting
- **Early Returns**: Functions return early when possible to avoid unnecessary computation

### 5. Code Organization

- **Separation of Concerns**: Clear separation between detection, creation, and utility functions
- **Single Responsibility**: Each function has a single, clear purpose
- **Consistent Naming**: Descriptive function and variable names

## Testing Strategy

### Test Structure

- **Unit Tests**: Located in `__tests__/unit/` within each package
- **Integration Tests**: Located in `__tests__/full/` (library) and `__tests__/integration/` (service)
- **Performance Tests**: Located in `__perf__/` (library package only)

### Test Patterns

- **Jest Framework**: Used for all testing
- **Mocking**: External dependencies are mocked
- **Edge Cases**: Tests cover edge cases and error conditions
- **Property Testing**: Tests verify mathematical properties

### Test Coverage

- **High Coverage**: Comprehensive test coverage across all modules
- **Integration Testing**: Tests verify that components work together
- **Performance Testing**: Tests verify performance characteristics

## Development Guidelines

### When Adding New Features

1. **Follow Existing Patterns**: Use the same coding style and patterns
2. **Add Tests**: Include comprehensive tests for new functionality
3. **Update Documentation**: Update type definitions and comments
4. **Consider Performance**: Profile new code for performance impact

### When Modifying Existing Code

1. **Maintain API Compatibility**: Don't break existing APIs
2. **Update Tests**: Update tests to reflect changes
3. **Add Performance Tests**: If performance is affected, add benchmarks
4. **Document Changes**: Update documentation for significant changes

### For Monorepo Development

1. **Package-Specific Development**: Work within the appropriate package directory
2. **Cross-Package Dependencies**: Be mindful of dependencies between packages
3. **Build Consistency**: Ensure all packages build successfully together
4. **Version Management**: Keep package versions synchronized when needed

### Code Quality Standards

- **ESLint**: Code follows ESLint rules with TypeScript plugin
- **TypeScript Strict Mode**: Use strict TypeScript settings
- **No `any` Types**: Avoid `any` types; use proper typing
- **Descriptive Comments**: Add JSDoc comments for public APIs

## Common Pitfalls and Solutions

### 1. Performance Issues

- **Problem**: Expensive repeated calculations
- **Solution**: Use `purify` utility for memoization
- **Example**: Hand evaluation results are cached

### 2. Edge Cases

- **Problem**: Missing edge cases in poker rules
- **Solution**: Comprehensive test coverage for all hand types
- **Example**: Ace-low straights, flush detection

### 3. Type Safety

- **Problem**: Runtime type errors
- **Solution**: Strong TypeScript typing and runtime validation
- **Example**: Card string parsing with validation

### 4. Algorithm Complexity

- **Problem**: Inefficient algorithms for large inputs
- **Solution**: Optimized algorithms and early termination
- **Example**: Combination calculations with pruning

## Performance Considerations

### Optimization Techniques

- **Caching**: Use `purify` for expensive calculations
- **Pre-sorting**: Sort data once and reuse sorted results
- **Early Termination**: Stop processing when result is determined
- **Efficient Data Structures**: Use appropriate data structures for operations

### Performance Testing

- **Benchmarking**: Use `packages/library/__perf__/` directory for performance tests
- **Profiling**: Use Node.js profiler for performance analysis
- **Memory Usage**: Monitor memory usage for large datasets

## Integration Guidelines

### For Library Users

- **Import Pattern**: Use named imports from main module
- **Type Safety**: Leverage TypeScript definitions for better IDE support
- **Error Handling**: Handle potential errors from invalid inputs
- **Performance**: Be aware of computational complexity for large inputs

### For Extension Developers

- **Follow Conventions**: Use the same patterns and conventions
- **Add Tests**: Include comprehensive tests for new functionality
- **Document APIs**: Provide clear documentation for new APIs
- **Maintain Compatibility**: Ensure backward compatibility

### For Library Users

- **Import Pattern**: Use named imports from main module
- **Type Safety**: Leverage TypeScript definitions for better IDE support
- **Error Handling**: Handle potential errors from invalid inputs
- **Performance**: Be aware of computational complexity for large inputs

## Future Enhancements

### Potential Improvements

- **Additional Game Types**: Support for other poker variants
- **Advanced Odds**: More sophisticated odds calculation algorithms

## Conclusion

This poker hands library demonstrates excellent TypeScript practices with:

- Clean, maintainable code architecture
- Strong type safety and error handling
- Performance optimizations for complex calculations
- Comprehensive testing strategy
- Clear separation of concerns

When working with this codebase, maintain the high standards of code quality, performance, and testing that have been established.
