# Straight and Straight Flush Function Specifications

This document provides comprehensive specifications for detector and getter functions for straight and straight flush implementations in both TypeScript and Rust.

## Overview

The specifications cover two types of functions:

- **Detector functions**: Return boolean indicating presence of a specific hand type
- **Getter functions**: Return the actual hand cards and metadata when a hand is found

## TypeScript Specifications

### Detector Functions

#### `hasStraight(cards: Card[], presortedValues?: Value[]): boolean`

**Purpose**: Detects if a straight (5 consecutive cards) exists within the given cards.

**Parameters**:

- `cards: Card[]` - Array of playing cards to analyze
- `presortedValues?: Value[]` - Optional pre-sorted array of card values for optimization (default: calculated from cards)

**Return Value**:

- `boolean` - `true` if a straight is found, `false` otherwise

**Edge Cases**:

- **Ace-low straight**: Handles A-2-3-4-5 straight by treating Ace as value 1
- **Duplicate values**: Automatically filters duplicate card values
- **Insufficient cards**: Returns `false` if fewer than 5 unique values exist

**Performance Characteristics**:

- Time Complexity: O(n log n) due to sorting (when presortedValues not provided)
- Space Complexity: O(n) for storing unique values

**Examples**:

```typescript
// Regular straight
const cards1 = cards("5h", "6d", "7c", "8s", "9h");
hasStraight(cards1); // true

// Ace-low straight (A-2-3-4-5)
const cards2 = cards("Ah", "2d", "3c", "4s", "5h");
hasStraight(cards2); // true

// No straight
const cards3 = cards("2h", "4d", "6c", "8s", "Th");
hasStraight(cards3); // false

// With duplicates
const cards4 = cards("5h", "5d", "6c", "7s", "8h", "9d");
hasStraight(cards4); // true (ignores duplicate 5)
```

---

#### `hasStraightFlush(cards: Card[], presortedValues?: Value[], presortedSuits?: Suit[][], alreadyHasFlush?: boolean, alreadyHasStraight?: boolean): boolean`

**Purpose**: Detects if a straight flush (5 consecutive cards of the same suit) exists within the given cards.

**Parameters**:

- `cards: Card[]` - Array of playing cards to analyze
- `presortedValues?: Value[]` - Optional pre-sorted array of card values for optimization
- `presortedSuits?: Suit[][]` - Optional pre-sorted array of suits for optimization
- `alreadyHasFlush?: boolean` - Optional pre-computed flush detection result
- `alreadyHasStraight?: boolean` - Optional pre-computed straight detection result

**Return Value**:

- `boolean` - `true` if a straight flush is found, `false` otherwise

**Edge Cases**:

- **Royal flush**: A-K-Q-J-10 of the same suit is detected as a straight flush
- **Ace-low straight flush**: A-2-3-4-5 of the same suit is handled correctly
- **Multiple flushes**: Only checks suits with 5+ cards for straight potential
- **Optimization**: Uses pre-computed results when provided for better performance

**Performance Characteristics**:

- Time Complexity: O(n) when pre-computed values are provided, O(n log n) otherwise
- Space Complexity: O(n) for storing suit-grouped values

**Examples**:

```typescript
// Regular straight flush
const cards1 = cards("5h", "6h", "7h", "8h", "9h");
hasStraightFlush(cards1); // true

// Royal flush
const cards2 = cards("Th", "Jh", "Qh", "Kh", "Ah");
hasStraightFlush(cards2); // true

// Ace-low straight flush
const cards3 = cards("Ah", "2h", "3h", "4h", "5h");
hasStraightFlush(cards3); // true

// Flush but not straight
const cards4 = cards("2h", "5h", "7h", "9h", "Jh");
hasStraightFlush(cards4); // false

// Straight but not flush
const cards5 = cards("5h", "6d", "7c", "8s", "9h");
hasStraightFlush(cards5); // false
```

### Getter Functions

#### `getStraight(cards: Card[]): Hand<HandType.Straight> | null`

**Purpose**: Extracts the highest straight from the given cards and returns hand metadata.

**Parameters**:

- `cards: Card[]` - Array of playing cards to analyze

**Return Value**:

- `Hand<HandType.Straight>` - Object containing hand metadata if straight found
- `null` - If no straight is found

**Hand Structure**:

```typescript
{
  type: HandType.Straight,
  cards: () => Card[],      // The 5 cards that form the straight
  value: () => Value,       // The highest value in the straight
  subvalue: () => null,     // No subvalue for straights
  kickers: () => Card[]     // Empty array for straights
}
```

**Edge Cases**:

- **Multiple straights**: Returns the highest possible straight
- **Ace-low straight**: Correctly identifies A-2-3-4-5 and sets Ace as the highest card
- **Duplicate values**: Handles cards with duplicate values correctly
- **7-card hands**: Properly extracts the best 5-card straight from 7 cards

**Performance Characteristics**:

- Time Complexity: O(n log n) for sorting and analysis
- Space Complexity: O(n) for intermediate arrays

**Examples**:

```typescript
// Regular straight
const cards1 = cards("5h", "6d", "7c", "8s", "9h", "Th", "Jc");
const straight1 = getStraight(cards1);
straight1.cards(); // [9h, Th, Jc, 8s, 7c] (highest possible)
straight1.value(); // Value.Jack

// Ace-low straight
const cards2 = cards("Ah", "2d", "3c", "4s", "5h");
const straight2 = getStraight(cards2);
straight2.cards(); // [5h, 4s, 3c, 2d, Ah]
straight2.value(); // Value.Ace

// No straight
const cards3 = cards("2h", "4d", "6c", "8s", "Th");
const straight3 = getStraight(cards3); // null
```

---

#### `getStraightFlush(cards: Card[]): Hand<HandType.StraightFlush> | null`

**Purpose**: Extracts the highest straight flush from the given cards and returns hand metadata.

**Parameters**:

- `cards: Card[]` - Array of playing cards to analyze

**Return Value**:

- `Hand<HandType.StraightFlush>` - Object containing hand metadata if straight flush found
- `null` - If no straight flush is found

**Hand Structure**:

```typescript
{
  type: HandType.StraightFlush,
  cards: () => Card[],      // The 5 cards that form the straight flush
  value: () => Value,       // The highest value in the straight flush
  subvalue: () => null,     // No subvalue for straight flushes
  kickers: () => Card[]     // Empty array for straight flushes
}
```

**Edge Cases**:

- **Royal flush**: Correctly identifies and returns A-K-Q-J-10 of the same suit
- **Ace-low straight flush**: Properly handles A-2-3-4-5 of the same suit
- **Multiple suits**: Only checks suits with 5+ cards
- **7-card hands**: Properly extracts the best 5-card straight flush from 7 cards

**Performance Characteristics**:

- Time Complexity: O(n log n) for sorting and analysis
- Space Complexity: O(n) for suit-grouped arrays

**Examples**:

```typescript
// Regular straight flush
const cards1 = cards("5h", "6h", "7h", "8h", "9h", "Th", "Jh");
const straightFlush1 = getStraightFlush(cards1);
straightFlush1.cards(); // [9h, Th, Jh, 8h, 7h] (highest possible)
straightFlush1.value(); // Value.Jack

// Royal flush
const cards2 = cards("Th", "Jh", "Qh", "Kh", "Ah");
const royalFlush = getStraightFlush(cards2);
royalFlush.cards(); // [Ah, Kh, Qh, Jh, Th]
royalFlush.value(); // Value.Ace

// Ace-low straight flush
const cards3 = cards("Ah", "2h", "3h", "4h", "5h");
const aceLowFlush = getStraightFlush(cards3);
aceLowFlush.cards(); // [5h, 4h, 3h, 2h, Ah]
aceLowFlush.value(); // Value.Ace

// No straight flush
const cards4 = cards("5h", "6d", "7c", "8s", "9h");
const straightFlush4 = getStraightFlush(cards4); // null
```

## Rust Specifications

### Detector Functions

#### `has_straight(&self) -> bool`

**Purpose**: Detects if a straight (5 consecutive cards) exists within the hand.

**Parameters**:

- `&self` - Reference to the Hand struct containing cards

**Return Value**:

- `bool` - `true` if a straight is found, `false` otherwise

**Edge Cases**:

- **Ace-low straight**: Handles A-2-3-4-5 straight by treating Ace as value 1
- **Duplicate values**: Automatically filters duplicate card values using HashSet
- **Insufficient cards**: Returns `false` if fewer than 5 unique values exist

**Performance Characteristics**:

- Time Complexity: O(n log n) for sorting unique values
- Space Complexity: O(n) for storing unique values in HashSet

**Examples**:

```rust
// Regular straight
let cards = vec![
    Card::new(Suit::Hearts, Value::Five),
    Card::new(Suit::Diamonds, Value::Six),
    Card::new(Suit::Clubs, Value::Seven),
    Card::new(Suit::Spades, Value::Eight),
    Card::new(Suit::Hearts, Value::Nine),
];
let hand = Hand::new(cards);
hand.has_straight(); // true

// Ace-low straight
let cards = vec![
    Card::new(Suit::Hearts, Value::Ace),
    Card::new(Suit::Diamonds, Value::Two),
    Card::new(Suit::Clubs, Value::Three),
    Card::new(Suit::Spades, Value::Four),
    Card::new(Suit::Hearts, Value::Five),
];
let hand = Hand::new(cards);
hand.has_straight(); // true

// No straight
let cards = vec![
    Card::new(Suit::Hearts, Value::Two),
    Card::new(Suit::Diamonds, Value::Four),
    Card::new(Suit::Clubs, Value::Six),
    Card::new(Suit::Spades, Value::Eight),
    Card::new(Suit::Hearts, Value::Ten),
];
let hand = Hand::new(cards);
hand.has_straight(); // false
```

---

#### `has_straight_flush(&self) -> bool`

**Purpose**: Detects if a straight flush (5 consecutive cards of the same suit) exists within the hand.

**Parameters**:

- `&self` - Reference to the Hand struct containing cards

**Return Value**:

- `bool` - `true` if a straight flush is found, `false` otherwise

**Edge Cases**:

- **Royal flush**: A-K-Q-J-10 of the same suit is detected as a straight flush
- **Ace-low straight flush**: A-2-3-4-5 of the same suit is handled correctly
- **Multiple flushes**: Only checks suits with 5+ cards for straight potential
- **Optimization**: Reuses existing `has_straight` logic for each suit group

**Performance Characteristics**:

- Time Complexity: O(n) for suit grouping, plus O(n log n) for straight detection per suit
- Space Complexity: O(n) for storing suit-grouped cards

**Examples**:

```rust
// Regular straight flush
let cards = vec![
    Card::new(Suit::Hearts, Value::Five),
    Card::new(Suit::Hearts, Value::Six),
    Card::new(Suit::Hearts, Value::Seven),
    Card::new(Suit::Hearts, Value::Eight),
    Card::new(Suit::Hearts, Value::Nine),
];
let hand = Hand::new(cards);
hand.has_straight_flush(); // true

// Royal flush
let cards = vec![
    Card::new(Suit::Hearts, Value::Ten),
    Card::new(Suit::Hearts, Value::Jack),
    Card::new(Suit::Hearts, Value::Queen),
    Card::new(Suit::Hearts, Value::King),
    Card::new(Suit::Hearts, Value::Ace),
];
let hand = Hand::new(cards);
hand.has_straight_flush(); // true

// Ace-low straight flush
let cards = vec![
    Card::new(Suit::Hearts, Value::Ace),
    Card::new(Suit::Hearts, Value::Two),
    Card::new(Suit::Hearts, Value::Three),
    Card::new(Suit::Hearts, Value::Four),
    Card::new(Suit::Hearts, Value::Five),
];
let hand = Hand::new(cards);
hand.has_straight_flush(); // true

// Flush but not straight
let cards = vec![
    Card::new(Suit::Hearts, Value::Two),
    Card::new(Suit::Hearts, Value::Five),
    Card::new(Suit::Hearts, Value::Seven),
    Card::new(Suit::Hearts, Value::Nine),
    Card::new(Suit::Hearts, Value::Jack),
];
let hand = Hand::new(cards);
hand.has_straight_flush(); // false
```

### Getter Functions

#### `get_straight(&self) -> HandResult`

**Purpose**: Extracts the highest straight from the hand and returns hand metadata.

**Parameters**:

- `&self` - Reference to the Hand struct containing cards

**Return Value**:

- `HandResult` - Struct containing hand metadata if straight found
- Returns `HandType::HighCard` with empty cards if no straight found

**HandResult Structure**:

```rust
pub struct HandResult {
    hand_type: HandType,    // HandType::Straight
    cards: Vec<Card>,       // The 5 cards that form the straight
    kickers: Vec<Card>,     // Remaining cards (empty for straights)
}
```

**Edge Cases**:

- **Multiple straights**: Returns the highest possible straight
- **Ace-low straight**: Correctly identifies A-2-3-4-5 and sets Ace as the highest card
- **Duplicate values**: Handles cards with duplicate values correctly
- **7-card hands**: Properly extracts the best 5-card straight from 7 cards

**Performance Characteristics**:

- Time Complexity: O(n log n) for sorting and analysis
- Space Complexity: O(n) for intermediate arrays

**Examples**:

```rust
// Regular straight
let cards = vec![
    Card::new(Suit::Hearts, Value::Five),
    Card::new(Suit::Diamonds, Value::Six),
    Card::new(Suit::Clubs, Value::Seven),
    Card::new(Suit::Spades, Value::Eight),
    Card::new(Suit::Hearts, Value::Nine),
    Card::new(Suit::Diamonds, Value::Ten),
    Card::new(Suit::Clubs, Value::Jack),
];
let hand = Hand::new(cards);
let result = hand.get_straight();
result.hand_type(); // HandType::Straight
result.cards().len(); // 5
// Contains the highest possible straight: [Jack, Ten, Nine, Eight, Seven]

// Ace-low straight
let cards = vec![
    Card::new(Suit::Hearts, Value::Ace),
    Card::new(Suit::Diamonds, Value::Two),
    Card::new(Suit::Clubs, Value::Three),
    Card::new(Suit::Spades, Value::Four),
    Card::new(Suit::Hearts, Value::Five),
];
let hand = Hand::new(cards);
let result = hand.get_straight();
result.hand_type(); // HandType::Straight
result.cards().len(); // 5
// Contains: [Ace, Five, Four, Three, Two]

// No straight
let cards = vec![
    Card::new(Suit::Hearts, Value::Two),
    Card::new(Suit::Diamonds, Value::Four),
    Card::new(Suit::Clubs, Value::Six),
    Card::new(Suit::Spades, Value::Eight),
    Card::new(Suit::Hearts, Value::Ten),
];
let hand = Hand::new(cards);
let result = hand.get_straight();
result.hand_type(); // HandType::HighCard (fallback)
result.cards().len(); // 0
```

---

#### `get_straight_flush(&self) -> HandResult`

**Purpose**: Extracts the highest straight flush from the hand and returns hand metadata.

**Parameters**:

- `&self` - Reference to the Hand struct containing cards

**Return Value**:

- `HandResult` - Struct containing hand metadata if straight flush found
- Returns `HandType::HighCard` with empty cards if no straight flush found

**HandResult Structure**:

```rust
pub struct HandResult {
    hand_type: HandType,    // HandType::StraightFlush
    cards: Vec<Card>,       // The 5 cards that form the straight flush
    kickers: Vec<Card>,     // Remaining cards (empty for straight flushes)
}
```

**Edge Cases**:

- **Royal flush**: Correctly identifies and returns A-K-Q-J-10 of the same suit
- **Ace-low straight flush**: Properly handles A-2-3-4-5 of the same suit
- **Multiple suits**: Only checks suits with 5+ cards
- **7-card hands**: Properly extracts the best 5-card straight flush from 7 cards

**Performance Characteristics**:

- Time Complexity: O(n log n) for sorting and analysis
- Space Complexity: O(n) for suit-grouped arrays

**Examples**:

```rust
// Regular straight flush
let cards = vec![
    Card::new(Suit::Hearts, Value::Five),
    Card::new(Suit::Hearts, Value::Six),
    Card::new(Suit::Hearts, Value::Seven),
    Card::new(Suit::Hearts, Value::Eight),
    Card::new(Suit::Hearts, Value::Nine),
    Card::new(Suit::Hearts, Value::Ten),
    Card::new(Suit::Hearts, Value::Jack),
];
let hand = Hand::new(cards);
let result = hand.get_straight_flush();
result.hand_type(); // HandType::StraightFlush
result.cards().len(); // 5
// Contains the highest possible straight flush: [Jack, Ten, Nine, Eight, Seven]

// Royal flush
let cards = vec![
    Card::new(Suit::Hearts, Value::Ten),
    Card::new(Suit::Hearts, Value::Jack),
    Card::new(Suit::Hearts, Value::Queen),
    Card::new(Suit::Hearts, Value::King),
    Card::new(Suit::Hearts, Value::Ace),
];
let hand = Hand::new(cards);
let result = hand.get_straight_flush();
result.hand_type(); // HandType::StraightFlush
result.cards().len(); // 5
// Contains: [Ace, King, Queen, Jack, Ten]

// Ace-low straight flush
let cards = vec![
    Card::new(Suit::Hearts, Value::Ace),
    Card::new(Suit::Hearts, Value::Two),
    Card::new(Suit::Hearts, Value::Three),
    Card::new(Suit::Hearts, Value::Four),
    Card::new(Suit::Hearts, Value::Five),
];
let hand = Hand::new(cards);
let result = hand.get_straight_flush();
result.hand_type(); // HandType::StraightFlush
result.cards().len(); // 5
// Contains: [Ace, Five, Four, Three, Two]

// No straight flush
let cards = vec![
    Card::new(Suit::Hearts, Value::Five),
    Card::new(Suit::Diamonds, Value::Six),
    Card::new(Suit::Clubs, Value::Seven),
    Card::new(Suit::Spades, Value::Eight),
    Card::new(Suit::Hearts, Value::Nine),
];
let hand = Hand::new(cards);
let result = hand.get_straight_flush();
result.hand_type(); // HandType::HighCard (fallback)
result.cards().len(); // 0
```

## Implementation Notes

### TypeScript Implementation Guidelines

1. **JSDoc Format**: Use comprehensive JSDoc with `@param`, `@returns`, and `@example` tags
2. **Parameter Documentation**: Document all parameters including optional ones with default values
3. **Return Value Documentation**: Clearly explain what different return values represent
4. **Edge Cases**: Document special handling scenarios like Ace-low straights
5. **Performance**: Include time and space complexity analysis
6. **Examples**: Provide multiple usage examples covering different scenarios

### Rust Implementation Guidelines

1. **Documentation Comments**: Use `///` for comprehensive documentation
2. **Parameter Documentation**: Document all parameters and their purposes
3. **Return Value Documentation**: Explain what different return values represent
4. **Edge Cases**: Document special handling scenarios
5. **Performance**: Include complexity analysis
6. **Examples**: Provide code examples in documentation comments

### Cross-Language Consistency

1. **Function Names**: Maintain consistent naming conventions between TypeScript and Rust
2. **Parameter Names**: Use similar parameter names where applicable
3. **Return Value Semantics**: Ensure equivalent behavior between implementations
4. **Error Handling**: Define consistent fallback behaviors for edge cases
5. **Performance Targets**: Aim for similar performance characteristics in both implementations

## Testing Requirements

### Unit Tests

Each function should have comprehensive tests covering:

- **Happy Path**: Normal usage scenarios
- **Edge Cases**: Special handling scenarios (Ace-low, royal flush, etc.)
- **Error Cases**: Invalid inputs or no hand found scenarios
- **Performance**: Benchmark tests for critical functions

### Integration Tests

- Cross-validation between TypeScript and Rust implementations
- Test with various hand sizes (5, 6, and 7 cards)
- Test with duplicate cards and invalid combinations

### Test Coverage

- **Line Coverage**: Aim for 100% line coverage
- **Branch Coverage**: Ensure all code paths are tested
- **Edge Case Coverage**: Verify all edge cases are handled correctly
