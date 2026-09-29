# @malte.muth/poker-hands

A comprehensive TypeScript library for Texas Hold'em poker hand evaluation and odds calculation.

## Features

- **Hand Evaluation**: Determine the best possible poker hand from any set of cards
- **Hand Comparison**: Compare two poker hands to determine which is better
- **Odds Calculation**: Calculate winning probabilities using exhaustive or Monte Carlo methods
- **Hand Type Percentages**: Calculate the probability of achieving each hand type
- **Card Manipulation**: Create, shuffle, and manipulate poker decks and cards

## Installation

```bash
npm install @malte.muth/poker-hands
```

## Quick Start

```typescript
import {
  getBestHand,
  isBetterThan,
  odds,
  percentages,
  cards,
  create,
  shuffle,
} from "@malte.muth/poker-hands";

// Create cards from strings
const myCards = cards("Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h");

// Get the best possible hand
const bestHand = getBestHand(myCards);
console.log(bestHand); // Royal Flush

// Compare hands
const hand1 = getBestHand(cards("Ah", "Kh", "Qh", "Jh", "Th"));
const hand2 = getBestHand(cards("As", "Ad", "Ac", "Ks", "Kd"));
console.log(isBetterThan(hand1, hand2)); // true

// Calculate odds
const hole1 = cards("Ah", "Kh");
const hole2 = cards("7c", "2d");
const board = cards("Ts", "9h", "8c");
const oddsResult = odds([hole1, hole2], board);
console.log(oddsResult);

// Calculate hand type percentages
const percentagesResult = percentages(hole1, board);
console.log(percentagesResult);

// Create and shuffle a deck
const deck = create();
const shuffledDeck = shuffle(deck);
```

## API Reference

### Core Functions

#### `getBestHand(cards: Card[]): HandInterface | null`

Determines the best possible poker hand from a set of cards.

**Parameters:**

- `cards`: Array of cards to evaluate

**Returns:**

- `HandInterface` representing the best hand, or `null` if no valid hand can be formed

**Example:**

```typescript
const cards = cards("Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h");
const bestHand = getBestHand(cards);
// Returns: Royal Flush with cards Ah, Kh, Qh, Jh, Th
```

#### `hasEqualValue(a: Hand, b: Hand): boolean`

Checks if two hands have equal value.

**Parameters:**

- `a`: First hand to compare
- `b`: Second hand to compare

**Returns:**

- `true` if hands have equal value, `false` otherwise

**Example:**

```typescript
const hand1 = getBestHand(cards("Ah", "Kh", "Qh", "Jh", "Th"));
const hand2 = getBestHand(cards("Ah", "Kh", "Qh", "Jh", "Th"));
console.log(hasEqualValue(hand1, hand2)); // true
```

#### `isBetterThan(a: Hand, b: Hand): boolean`

Compares two hands to determine if the first hand is better than the second.

**Parameters:**

- `a`: First hand to compare
- `b`: Second hand to compare

**Returns:**

- `true` if hand `a` is better than hand `b`, `false` otherwise

**Example:**

```typescript
const royalFlush = getBestHand(cards("Ah", "Kh", "Qh", "Jh", "Th"));
const fullHouse = getBestHand(cards("As", "Ad", "Ac", "Ks", "Kd"));
console.log(isBetterThan(royalFlush, fullHouse)); // true
```

#### `handRank(hand: HandInterface): number`

Expresses the strength of a hand as a single number: a better hand has a higher rank, equally strong hands have the same rank. Ranks can be compared with `>` and `===` instead of `isBetterThan` and `hasEqualValue`, and sorted numerically.

The rank is the hand type followed by the five card values in order of importance, one hex digit each: the full house K K K 9 9 is `0x7ddd99`.

**Parameters:**

- `hand`: A hand, e.g. from `getBestHand`

**Returns:**

- The hand's rank, a positive integer below 2^24

**Example:**

```typescript
const kingsFull = getBestHand(cards("Kh", "Kd", "Ks", "9c", "9d"));
const queensFull = getBestHand(cards("Qh", "Qd", "Qs", "Ac", "Ad"));
console.log(handRank(kingsFull) > handRank(queensFull)); // true
```

### Odds Calculation

#### `odds(holes: Card[][], board: Card[] = [], options?: OddsOptions): HoleOdds[]`

Calculates winning odds for given hole cards and board using either exhaustive or Monte Carlo methods.

**Parameters:**

- `holes`: Array of hole cards for each player
- `board`: Currently revealed board cards (optional)
- `options`: Calculation options

**Options** (the `OddsOptions` type is exported):

```typescript
type OddsOptions = (
  | { mode: "auto"; threshold?: number }
  | { mode: "exhaustive" }
  | { mode: "monteCarlo"; sampleSize?: number }
) & {
  progress?: ProgressCallback;
};
```

**Returns:**

- Array of `HoleOdds` objects (also exported), one per player and in the same order

**Example:**

```typescript
const hole1 = cards("Ah", "Kh");
const hole2 = cards("7c", "2d");
const board = cards("Ts", "9h", "8c");

// Auto mode (chooses best method automatically)
const oddsResult = odds([hole1, hole2], board);

// Monte Carlo mode with custom sample size
const monteCarloResult = odds([hole1, hole2], board, {
  mode: "monteCarlo",
  sampleSize: 50000,
});

// With progress callback
const resultWithProgress = odds([hole1, hole2], board, {
  mode: "monteCarlo",
  sampleSize: 10000,
  progress: (progress) =>
    console.log(`Progress: ${Math.round(progress * 100)}%`),
});
```

#### `percentages(hole: Card[], board: Card[] = [], dead: Card[] = []): HandPercentages`

Calculates the probability of achieving each hand type for given hole cards and board.

**Parameters:**

- `hole`: Hole cards for a single player
- `board`: Currently revealed board cards (optional)
- `dead`: Cards that can no longer appear on the board, e.g. other players'
  hole cards (optional)

Throws an error if a card appears more than once in `hole`, `board` and `dead`.

**Returns:**

- `HandPercentages` object with probabilities for each hand type

**Example:**

```typescript
const hole = cards('Ah', 'Kh');
const board = cards('Ts', '9h', '8c');
const result = percentages(hole, board);

// Result structure:
{
  highCard: { count: 1520, percentage: 0.152 },
  pair: { count: 2510, percentage: 0.251 },
  twoPair: { count: 1030, percentage: 0.103 },
  threeOfAKind: { count: 510, percentage: 0.051 },
  straight: { count: 2040, percentage: 0.204 },
  flush: { count: 1520, percentage: 0.152 },
  fullHouse: { count: 510, percentage: 0.051 },
  fourOfAKind: { count: 210, percentage: 0.021 },
  straightFlush: { count: 190, percentage: 0.019 },
  royalFlush: { count: 60, percentage: 0.006 }
}
```

### Card Functions

#### `cards(...inputs: string[]): Card[]`

Creates an array of cards from string inputs.

**Parameters:**

- `inputs`: Variable number of card strings

**Returns:**

- Array of `Card` objects

**Example:**

```typescript
const cardsArray = cards("Ah", "Kh", "Qh", "Jh", "Th");
// Returns: [{ suit: 'hearts', value: 14 }, { suit: 'hearts', value: 13 }, ...]
```

#### `toString(card: Card): string`

Converts a card object to its string representation.

**Parameters:**

- `card`: Card object to convert

**Returns:**

- String representation of the card

**Example:**

```typescript
const card = { suit: "hearts", value: 14 };
console.log(toString(card)); // "Ah"
```

### Deck Functions

#### `create(): Card[]`

Creates a complete 52-card poker deck.

**Returns:**

- Array of all 52 cards in a standard deck

**Example:**

```typescript
const deck = create();
// Returns array with all 52 cards: 2h, 3h, ..., As
```

#### `shuffle(items: Card[]): Card[]`

Shuffles an array of cards using Fisher-Yates algorithm.

**Parameters:**

- `items`: Array of cards to shuffle

**Returns:**

- New array with shuffled cards

**Example:**

```typescript
const deck = create();
const shuffledDeck = shuffle(deck);
```

### Types

#### `ProgressCallback`

Callback function for reporting progress during calculations. `progress` is a
fraction between 0 and 1; it is reported every 100 boards or simulations, and
the last report is always 1.

```typescript
type ProgressCallback = (progress: number) => void;
```

**Example:**

```typescript
const progressCallback: ProgressCallback = (progress) => {
  console.log(`Calculation ${Math.round(progress * 100)}% complete`);
};
```

## Card Format

The library uses a standardized poker card format:

### String Representation

- **Values**: `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `T` (Ten), `J` (Jack), `Q` (Queen), `K` (King), `A` (Ace)
- **Suits**: `h` (hearts), `d` (diamonds), `c` (clubs), `s` (spades)

**Examples:**

- `Ah` - Ace of hearts
- `Td` - Ten of diamonds
- `Kc` - King of clubs
- `Qs` - Queen of spades

### Object Representation

```typescript
interface Card {
  suit: Suit; // 'hearts' | 'diamonds' | 'clubs' | 'spades'
  value: Value; // 2-14 (where 11=J, 12=Q, 13=K, 14=A)
}
```

## Hand Types

The library recognizes all standard poker hand types in order of rank (highest to lowest):

1. **Royal Flush** (10): Ace-high straight flush
2. **Straight Flush** (9): Five consecutive cards of the same suit
3. **Four of a Kind** (8): Four cards of the same value
4. **Full House** (7): Three of a kind plus a pair
5. **Flush** (6): Five cards of the same suit
6. **Straight** (5): Five consecutive cards
7. **Three of a Kind** (4): Three cards of the same value
8. **Two Pair** (3): Two different pairs
9. **Pair** (2): Two cards of the same value
10. **High Card** (1): No other combination, highest card wins

### Hand Interface

```typescript
interface HandInterface {
  type: HandType; // The type of hand
  value: () => Value; // Primary value for comparison
  subvalue: () => Value | null; // Secondary value for comparison (e.g., in full house)
  cards: () => Card[]; // All cards in the hand
  kickers: () => Card[]; // Kicker cards for tie-breaking
}
```

## Usage Examples

### Basic Hand Evaluation

```typescript
import { getBestHand, cards } from "@malte.muth/poker-hands";

// Evaluate a 7-card hand
const cards = cards("Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h");
const bestHand = getBestHand(cards);

console.log(`Best hand: ${bestHand.type}`);
console.log(`Cards: ${bestHand.cards().map(toString).join(", ")}`);
```

### Hand Comparison

```typescript
import { getBestHand, isBetterThan, cards } from "@malte.muth/poker-hands";

const hand1 = getBestHand(cards("Ah", "Kh", "Qh", "Jh", "Th"));
const hand2 = getBestHand(cards("As", "Ad", "Ac", "Ks", "Kd"));

if (isBetterThan(hand1, hand2)) {
  console.log("Royal Flush beats Full House");
}
```

### Odds Calculation

```typescript
import { odds, cards } from "@malte.muth/poker-hands";

// Pre-flop odds
const hole1 = cards("Ah", "Kh");
const hole2 = cards("7c", "2d");
const preFlopOdds = odds([hole1, hole2]);

console.log(
  `Player 1 win chance: ${(preFlopOdds[0].winChance * 100).toFixed(2)}%`,
);
console.log(
  `Player 2 win chance: ${(preFlopOdds[1].winChance * 100).toFixed(2)}%`,
);

// Post-flop odds
const board = cards("Ts", "9h", "8c");
const postFlopOdds = odds([hole1, hole2], board);
```

### Hand Type Analysis

```typescript
import { percentages, cards } from "@malte.muth/poker-hands";

const hole = cards("Ah", "Kh");
const board = cards("Ts", "9h", "8c");
const handPercentages = percentages(hole, board);

// Find most likely hand type
const mostLikelyHand = Object.entries(handPercentages).reduce(
  (max, [type, data]) =>
    data.percentage > max.percentage ? { type, ...data } : max,
  { type: "", percentage: 0 },
);

console.log(
  `Most likely hand: ${mostLikelyHand.type} (${(
    mostLikelyHand.percentage * 100
  ).toFixed(1)}%)`,
);
```

### Advanced Odds with Progress Tracking

```typescript
import { odds, cards, ProgressCallback } from "@malte.muth/poker-hands";

const progressCallback: ProgressCallback = (progress) => {
  console.log(`Calculation progress: ${Math.round(progress * 100)}%`);
};

const hole1 = cards("Ah", "Kh");
const hole2 = cards("7c", "2d");
const board = cards("Ts", "9h", "8c");

// Use Monte Carlo with progress tracking
const oddsResult = odds([hole1, hole2], board, {
  mode: "monteCarlo",
  sampleSize: 50000,
  progress: progressCallback,
});
```

### Working with Decks

```typescript
import { create, shuffle, cards, getBestHand } from "@malte.muth/poker-hands";

// Create a new deck
const deck = create();

// Shuffle the deck
const shuffledDeck = shuffle(deck);

// Deal cards to players
const player1Cards = shuffledDeck.slice(0, 2);
const player2Cards = shuffledDeck.slice(2, 4);
const flop = shuffledDeck.slice(4, 7);

// Evaluate hands
const player1Hand = getBestHand([...player1Cards, ...flop]);
const player2Hand = getBestHand([...player2Cards, ...flop]);

console.log(`Player 1: ${player1Hand.type}`);
console.log(`Player 2: ${player2Hand.type}`);
```

## TypeScript Support

The library is built with TypeScript and provides comprehensive type definitions:

```typescript
import { Card, HandType, HandInterface } from "@malte.muth/poker-hands";

// All types are available for your own type annotations
function evaluateHand(cards: Card[]): HandInterface | null {
  // Your implementation
}

// Hand types are properly typed
function getHandTypeName(type: HandType): string {
  switch (type) {
    case HandType.RoyalFlush:
      return "Royal Flush";
    case HandType.StraightFlush:
      return "Straight Flush";
    // ... other cases
  }
}
```

## Error Handling

The library provides clear error messages for invalid inputs:

```typescript
import { cards, getBestHand } from "@malte.muth/poker-hands";

try {
  // Invalid card
  const invalidCards = cards("1h", "Xz");
} catch (error) {
  console.error(error.message); // "Could not convert string 1h to a card."
}

try {
  // Insufficient cards for a hand
  const insufficientCards = cards("Ah");
  const hand = getBestHand(insufficientCards);
} catch (error) {
  console.error(error.message); // "Need at least 5 cards to form a hand"
}

try {
  // Duplicate cards in odds calculation
  const duplicateCards = odds([cards("Ah", "Kh"), cards("Ah", "Kh")]);
} catch (error) {
  console.error(error.message); // "Duplicate cards found"
}
```

## Performance Considerations

### Algorithm Selection

The library automatically selects the best algorithm based on the number of combinations:

- **Exhaustive**: Used when combinations ≤ `threshold` (exact results)
- **Monte Carlo**: Used when combinations > `threshold`, with `threshold` samples (statistical approximation)

The default threshold of 2,200,000 is above the most boards any spot can have
(2,118,760 for a single hole pre-flop), so by default every calculation is
exact. Pass a lower threshold to trade precision for speed.

You can manually override this behavior:

```typescript
// Force exhaustive calculation (exact but slower)
const exactOdds = odds([hole1, hole2], board, { mode: "exhaustive" });

// Force Monte Carlo (faster but approximate)
const approximateOdds = odds([hole1, hole2], board, {
  mode: "monteCarlo",
  sampleSize: 10000,
});
```

### How It Is Fast

Odds and percentages don't build a hand object for each board. The cards are kept as four bit masks, one per suit, and a hand's rank is computed from those with a few integer operations and lookup tables: pairs, trips and quads follow from which values appear in two, three or four suits. While all boards are enumerated, the board's masks are passed along as plain numbers, and each player's cards are combined with them. The calculations allocate almost nothing, however many boards they cover.

### Benchmarks

Measured with `npm run bench` on a laptop with Node 24, as CPU time; wall-clock time is higher on a busy machine:

- **Hand evaluation** (7 cards, ranked without building a hand): about 5 million hands per second
- **Exhaustive odds**, pre-flop (heads-up: 1,712,304 boards; 4 players: 1,086,008 boards): under 0.2 seconds
- **Exhaustive odds**, heads-up on the flop (990 boards): under 1 ms
- **Monte Carlo odds**, 10,000 samples: about 3 ms
- **Percentages**, pre-flop (2,118,760 boards): about 0.1 seconds

`npm run bench -- --quick` skips the pre-flop cases. Each case is measured three times and the two fastest are averaged; besides wall-clock and CPU time, the benchmark reports how much each case allocates and how much time goes into garbage collection.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Submit a pull request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/malte-muth/poker-hands.git
cd poker-hands/packages/library

# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build the library
npm run build
```

### Testing Guidelines

- Add unit tests for new functionality
- Include integration tests for complex scenarios
- Ensure all tests pass before submitting
- Test edge cases and error conditions

## License

MIT License - see the [LICENSE](../../LICENSE) file for details.
