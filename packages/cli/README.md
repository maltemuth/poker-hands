# @malte.muth/poker-hands-cli

[![npm](https://img.shields.io/npm/v/@malte.muth/poker-hands-cli)](https://www.npmjs.com/package/@malte.muth/poker-hands-cli)
[![npm](https://img.shields.io/npm/dt/@malte.muth/poker-hands-cli)](https://www.npmjs.com/package/@malte.muth/poker-hands-cli)

A command-line interface for Texas Hold'em poker hand evaluation, odds calculation, and more. Built with Commander.js and TypeScript.

This package is almost entirely AI-generated.

## Installation

### Global Installation

```bash
npm install -g @malte.muth/poker-hands-cli
```

### Local Installation

```bash
npm install @malte.muth/poker-hands-cli
```

## Quick Start

After installation, you can use the CLI from anywhere:

```bash
# Get help
poker-hands --help

# Calculate odds
poker-hands odds AhKh 7c2d Ts9h8c

# Calculate percentages
poker-hands percentages AhKh 7c2d Ts9h8c
```

## Commands

### `odds`

Calculate winning odds for given hole cards and board.

```bash
poker-hands odds <hole1> <hole2> [board...]
```

**Arguments:**

- `hole1`: First player hole cards (e.g., "2h Td")
- `hole2`: Second player hole cards (e.g., "3c 4d")
- `board...`: Community board cards (optional)

**Example:**

```bash
# Pre-flop odds
poker-hands odds AhKh 7c2d

# Post-flop odds
poker-hands odds AhKh 7c2d Ts9h8c

# Output:
# Player 1 (Ah Kh): 65.23% win probability
# Player 2 (7c 2d): 34.77% win probability
#
# Hand Type Probabilities:
# Player 1:
#   High Card: 15.2%
#   Pair: 25.1%
#   Two Pair: 10.3%
#   Three of a Kind: 5.1%
#   Straight: 20.4%
#   Flush: 15.2%
#   Full House: 5.1%
#   Four of a Kind: 2.1%
#   Straight Flush: 1.9%
#   Royal Flush: 0.6%
#
# Player 2:
#   High Card: 25.4%
#   Pair: 30.2%
#   Two Pair: 15.1%
#   Three of a Kind: 8.3%
#   Straight: 10.2%
#   Flush: 8.1%
#   Full House: 2.8%
#   Four of a Kind: 0.8%
#   Straight Flush: 0.1%
#   Royal Flush: 0.0%
```

### `percentages`

Calculate hand type percentages for given hole cards and board.

```bash
poker-hands percentages <hole1> <hole2> [board...]
```

**Arguments:**

- `hole1`: First player hole cards (e.g., 2hTd)
- `hole2`: Second player hole cards (e.g., 3c4d)
- `board...`: Community board cards (optional)

**Example:**

```bash
# Pre-flop percentages
poker-hands percentages AhKh 7c2d

# Post-flop percentages
poker-hands percentages AhKh 7c2d Ts9h8c

# Output:
# Player 1 (Ah Kh):
#   High Card: 15.2%
#   Pair: 25.1%
#   Two Pair: 10.3%
#   Three of a Kind: 5.1%
#   Straight: 20.4%
#   Flush: 15.2%
#   Full House: 5.1%
#   Four of a Kind: 2.1%
#   Straight Flush: 1.9%
#   Royal Flush: 0.6%
#
# Player 2 (7c 2d):
#   High Card: 25.4%
#   Pair: 30.2%
#   Two Pair: 15.1%
#   Three of a Kind: 8.3%
#   Straight: 10.2%
#   Flush: 8.1%
#   Full House: 2.8%
#   Four of a Kind: 0.8%
#   Straight Flush: 0.1%
#   Royal Flush: 0.0%
```

## Card Format

The CLI uses the standard poker card format:

- **Values**: `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `T` (Ten), `J` (Jack), `Q` (Queen), `K` (King), `A` (Ace)
- **Suits**: `h` (hearts), `d` (diamonds), `c` (clubs), `s` (spades)

**Examples:**

- `Ah` - Ace of hearts
- `Td` - Ten of diamonds
- `Kc` - King of clubs
- `Qs` - Queen of spades

## Usage Examples

### Odds Calculation

```bash
# Calculate pre-flop odds
poker-hands odds AhKh 7c2d

# Calculate post-flop odds
poker-hands odds AhKh 7c2d Ts9h8c

# Calculate turn odds
poker-hands odds AhKh 7c2d Ts9h8c 7d

# Calculate river odds
poker-hands odds AhKh 7c2d Ts9h8c 7d 2h
```

### Hand Type Percentages

```bash
# Calculate pre-flop percentages
poker-hands percentages AhKh 7c2d

# Calculate post-flop percentages
poker-hands percentages AhKh 7c2d Ts9h8c
```

## Error Handling

The CLI provides clear error messages for invalid inputs:

```bash
# Invalid card
poker-hands best-hand 1hXz
# Error: Invalid card: 1h (invalid value)
# Error: Invalid card: Xz (invalid value and suit)

# Missing cards
poker-hands best-hand Ah
# Error: Need at least 5 cards to form a hand

# Invalid odds calculation
poker-hands odds Ah Kh
# Error: Need at least 2 hole card sets for odds calculation
```

## Advanced Usage

### JSON Output

```bash
# Enable JSON output
poker-hands --format json best-hand Ah Kh Qh Jh Th

# Output:
{
  "bestHand": {
    "type": "royalFlush",
    "cards": ["Ah", "Kh", "Qh", "Jh", "Th"],
    "rank": 10
  },
  "allHands": [
    {
      "type": "royalFlush",
      "cards": ["Ah", "Kh", "Qh", "Jh", "Th"],
      "rank": 10
    },
    {
      "type": "flush",
      "cards": ["Ah", "Kh", "Qh", "Jh", "9h"],
      "rank": 6
    }
  ]
}
```

## Performance Considerations

- Odds calculations can take time for complex scenarios
- Use the `--help` flag to see all available options
- For large batch processing, consider using the library directly

## License

MIT License - see the [LICENSE](../../LICENSE) file for details.
