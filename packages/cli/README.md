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

## JSON Output

The CLI supports JSON output for interoperability with other tools:

```bash
poker-hands odds AhKh QdJd --board Ts9h8c --json
poker-hands percentages AhKh QdJdTs --json
```

## JSON Schemas

For programmatic use, JSON schemas are provided to validate the output format:

### Odds Command Schema

The odds command returns a JSON object with the following structure:

```json
{
  "success": true,
  "command": "odds",
  "data": {
    "players": [
      {
        "holeCards": ["Ah", "Kh"],
        "winChance": 0.65,
        "tieChance": 0.05,
        "winChanceError": 0.02
      }
    ]
  }
}
```

**Schema Location:** [`schemas/odds.json`](./schemas/odds.json)

### Percentages Command Schema

The percentages command returns a JSON object with the following structure:

```json
{
  "success": true,
  "command": "percentages",
  "data": {
    "highCard": {
      "count": 123456,
      "percentage": 0.123456
    },
    "pair": {
      "count": 98765,
      "percentage": 0.098765
    }
    // ... other hand types
  }
}
```

**Schema Location:** [`schemas/percentages.json`](./schemas/percentages.json)

## Command Options

### Odds Command

- `<holes...>`: One argument per player with their hole cards (e.g., `AhKh QdJd`)
- `--board <board>`: Community board cards as one argument (e.g., `2h5d9c` or `"2h 5d 9c"`)
- `-m, --mode <mode>`: Calculation mode (auto, exhaustive, monteCarlo)
- `-t, --threshold <threshold>`: Threshold for auto mode (default: 10000)
- `-s, --sample-size <sampleSize>`: Sample size for monte-carlo mode (default: 10000)
- `--progress`: Show progress during calculation
- `--json`: Output results in JSON format

### Percentages Command

- `<hole>`: Hole cards (e.g., `AhKh`)
- `[board...]`: Community board cards, as one or several arguments (e.g., `QdJdTs` or `Qd Jd Ts`)
- `--json`: Output results in JSON format

## Error Handling

Both commands return error information in JSON format when the `--json` flag is used:

```json
{
  "success": false,
  "command": "odds",
  "error": "Invalid card format: 'invalid'"
}
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

### JSON Output for Integration

```bash
# Get odds in JSON format for processing
poker-hands odds AhKh QdJd --board Ts9h8c --json | jq '.data.players[0].winChance'
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
