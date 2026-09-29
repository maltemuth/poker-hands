# Poker Hands CLI

A command-line interface for the poker hands library, providing tools for calculating odds and hand percentages.

## Installation

```bash
npm install -g @malte.muth/poker-hands-cli
```

## Usage

### Odds Calculation

Calculate winning odds for each player's hole cards, optionally with a board:

```bash
poker-hands odds AhKh QdJd --board Ts9h8c
```

### Percentages Calculation

Calculate hand type percentages for given hole cards and an optional board:

```bash
poker-hands percentages AhKh QdJdTs
```

## Command Options

### Odds Command

- `<holes...>`: One argument per player with their hole cards (e.g., `AhKh QdJd`)
- `--board <board>`: Community board cards as one argument (e.g., `2h5d9c` or `"2h 5d 9c"`)
- `--progress`: Show progress during calculation

### Percentages Command

- `<hole>`: Hole cards (e.g., `AhKh`)
- `[board...]`: Community board cards, as one or several arguments (e.g., `QdJdTs` or `Qd Jd Ts`)

## Error Handling

Invalid input, such as an unknown card or a card used twice, prints `Error:` and the reason to stderr, and the command exits with status 1:

```bash
$ poker-hands percentages AhAh
Error: Duplicates found in card list 'Ah,Ah'
```

## Card Format

Cards are specified in the format "valueSuit":

- Values: 2-9, T (10), J (Jack), Q (Queen), K (King), A (Ace)
- Suits: h (hearts), d (diamonds), c (clubs), s (spades)

Examples: "Ah" (Ace of hearts), "Td" (10 of diamonds), "2c" (2 of clubs)

Several cards can be written together (`AhKh`) or separated by spaces (`"Ah Kh"`).

## Examples

### Basic Odds Calculation

```bash
# Two players with hole cards, no board
poker-hands odds "AhKh" "QdJd"

# With community cards
poker-hands odds "AhKh" "QdJd" --board "2s3s4s"
```

### Percentages Calculation

```bash
# Pre-flop hand percentages
poker-hands percentages "AhKh"

# With flop cards
poker-hands percentages "AhKh" "2s3s4s"
```

## Development

```bash
npm run build   # compile to dist/ (build the library first)
npm test        # run the tests against the library sources
npm start -- odds AhKh QdJd   # run the CLI from source
```

See the main [poker-hands](../library) package for library documentation.
