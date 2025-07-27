# Module Structure for Poker Hands Library in Rust

Based on the analysis of the current JavaScript/TypeScript codebase, the following module structure is proposed for the Rust/WASM implementation:

1. **card.rs**: Card data structure and operations

   - Card creation and validation
   - Value and suit manipulation
   - String representation

2. **hand.rs**: Hand data structure and detection algorithms

   - Hand ranking logic
   - Hand type detection (pair, flush, straight, etc.)
   - Hand comparison

3. **combinatorics.rs**: Combinatorial functions

   - Combinations and permutations
   - Utility functions for hand evaluation

4. **deck.rs**: Deck creation and shuffling

   - Deck initialization
   - Shuffling algorithms

5. **odds.rs**: Odds and probability calculations

   - Win probability estimation
   - Hand evaluation for odds calculation

6. **lib.rs**: Entry point for the WASM module

   - Re-exports of public APIs
   - WASM bindings using `wasm-bindgen`

7. **errors.rs**: Error handling and custom error types

   - Custom error types for card/hand validation
   - Result type aliases for common operations

8. **tests/**: Test suite for the Rust implementation
   - Unit tests for individual modules
   - Integration tests for cross-module functionality
   - Benchmarks for performance testing
