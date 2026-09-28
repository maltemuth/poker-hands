# @malte.muth/poker-hands-service

A REST API service for Texas Hold'em poker odds calculation. Built on Express.js with TypeScript.

This package is almost entirely AI-generated.

## Installation

```bash
npm install @malte.muth/poker-hands-service
```

## CLI Usage

The package includes a command-line interface for starting the service with custom configuration.

### Basic CLI Usage

```bash
# Start the service with default settings (port 3000, CORS enabled, 5 max concurrent requests)
poker-hands-service start

# Start with custom port
poker-hands-service start --port 8080

# Start with CORS disabled
poker-hands-service start --no-cors

# Start with custom max concurrent requests
poker-hands-service start --max-requests 10

# Start with both custom port and CORS disabled
poker-hands-service start --port 8080 --no-cors

# Start with all custom settings
poker-hands-service start -p 8080 --no-cors -r 3

# Short form for port and max requests
poker-hands-service start -p 8080 -r 10
```

### CLI Options

- `-p, --port <port>`: Port to run the service on (default: 3000)
- `--no-cors`: Disable CORS headers
- `-r, --max-requests <maxRequests>`: Maximum concurrent requests (default: 5, range: 1-100)
- `-h, --help`: Display help information

### Global Installation

After installing the package, you can use the CLI globally:

```bash
# Install the package globally
npm install -g @malte.muth/poker-hands-service

# Use the CLI from anywhere
poker-hands-service start --port 8080
```

## Quick Start

### Basic Usage

```typescript
import { PokerHandsService } from "@malte.muth/poker-hands-service";

// Create and start the service with default configuration
const service = new PokerHandsService();
service.start();

// Or with custom configuration
const service = new PokerHandsService({
  port: 8080,
  cors: true,
});
service.start();
```

### Using the Service Class

```typescript
import { PokerHandsService } from "@malte.muth/poker-hands-service";

// Create and start the service
const service = new PokerHandsService({ port: 3000 });
service.start();
```

## API Endpoints

The service provides REST API endpoints for poker calculations.

### Odds Calculation

**POST** `/api/odds`

Calculate winning odds for given hole cards and board.

**Request Body:**

```json
{
  "holes": [
    ["Ah", "Kh"],
    ["7c", "2d"]
  ],
  "board": ["Ts", "9h", "8c"],
  "options": { "mode": "monteCarlo", "sampleSize": 50000 }
}
```

- `holes`: at least two players with exactly two cards each
- `board` (optional): up to five community cards
- `options` (optional): `mode` is `auto` (default), `exhaustive` or
  `monteCarlo`; `threshold` applies to `auto` mode (the maximum number of
  boards to calculate exactly, default 10000), `sampleSize` to `monteCarlo`
  mode (default 10000)

**Response:**

One entry per player, in the order of `holes`. `winChanceError` (the 95%
margin of error) is only present for Monte Carlo results.

```json
{
  "players": [
    {
      "holeCards": ["Ah", "Kh"],
      "winChance": 0.65,
      "tieChance": 0.05,
      "winChanceError": 0.02
    },
    { "holeCards": ["7c", "2d"], "winChance": 0.3, "tieChance": 0.05 }
  ]
}
```

### Hand Type Percentages

**POST** `/api/percentages`

Calculate how often each player makes each hand type over all possible boards.
Each player's calculation treats the other players' hole cards as dead cards.

**Request Body:**

```json
{
  "holes": [
    ["Ah", "Kh"],
    ["Th", "9c"]
  ],
  "board": ["Qh", "Jh", "2c"]
}
```

- `holes`: at least one player with exactly two cards each
- `board` (optional): up to five community cards

**Response:**

One entry per player, in the order of `holes`, with `count` (boards on which
the player makes the hand type) and `percentage` (share of all boards) for each
of the ten hand types.

```json
{
  "players": [
    {
      "holeCards": ["Ah", "Kh"],
      "percentages": {
        "highCard": { "count": 171, "percentage": 0.1727 },
        "pair": { "count": 299, "percentage": 0.302 },
        "flush": { "count": 324, "percentage": 0.3273 },
        "royalFlush": { "count": 0, "percentage": 0 }
      }
    }
  ]
}
```

(Shortened: every player gets all ten hand types, from `highCard` to
`royalFlush`.) The calculation is exhaustive, so before the flop it can take a
while.

### Health Check

**GET** `/health`

Health check endpoint.

**Response:**

```json
{ "status": "healthy" }
```

## Configuration

### PokerHandsService

```typescript
new PokerHandsService(
  port?: number, // Server port (default: 3000)
  corsEnabled?: boolean, // Enable CORS (default: true)
  maxConcurrentRequests?: number // Maximum concurrent calculations (default: 5)
);
```

### Example Configuration

```typescript
import { PokerHandsService } from "@malte.muth/poker-hands-service";

const service = new PokerHandsService(8080, true, 10);
service.start();
```

## Error Handling

Errors are returned as a JSON string with the message:

```json
"Holes must be provided as an array with at least 2 players"
```

### Common Error Codes

- `400 Bad Request`: invalid input, or cards the library rejects (e.g. a card
  used twice)
- `429 Too Many Requests`: all calculation slots are busy
  (`"Too many concurrent requests"`)
- `500 Internal Server Error`: unexpected error during the calculation

## Middleware

The service includes built-in middleware:

### Validation Middleware

- Validates card format and values
- Validates request structure
- Provides detailed error messages

### CORS Middleware

- Configurable cross-origin resource sharing
- Supports enabling/disabling CORS

## How Calculations Run

Each odds and percentages request is calculated with the poker library in its
own worker thread, so long calculations don't block the service: other requests and the
health check are answered in the meantime.

At most `maxConcurrentRequests` calculations (default 5) run at once; further
requests get a `429` until a slot is free. A slot stays occupied until its
calculation has finished, even if the client disconnects earlier, so an
exhaustive pre-flop calculation holds its slot for as long as it runs.

## Development

### Running in Development Mode

```bash
# Install dependencies
npm install

# Run in development mode (with tsx)
npm run dev

# Build the service
npm run build

# Run the built service
npm start

# Run the CLI (development mode)
npm run cli

# Run the CLI with options
npm run cli -- start --port 8080 --no-cors --max-requests 10
```

### Using the CLI

The CLI provides a convenient way to start the service with custom configuration:

```bash
# Start with default settings
poker-hands-service start

# Start with custom port
poker-hands-service start --port 8080

# Start with CORS disabled
poker-hands-service start --no-cors

# Start with custom max concurrent requests
poker-hands-service start --max-requests 10

# Start with both custom port and CORS disabled
poker-hands-service start --port 8080 --no-cors

# Start with all custom settings
poker-hands-service start -p 8080 --no-cors -r 3

# View help
poker-hands-service --help
poker-hands-service start --help
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Integration Examples

### Using with curl

```bash
# Odds calculation
curl -X POST http://localhost:3000/api/odds \
  -H "Content-Type: application/json" \
  -d '{"holes": [["Ah", "Kh"], ["7c", "2d"]], "board": ["Ts", "9h", "8c"]}'
```

### Using with JavaScript/Node.js

```javascript
// Odds calculation
async function getOdds() {
  const response = await fetch("http://localhost:3000/api/odds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      holes: [
        ["Ah", "Kh"],
        ["7c", "2d"],
      ],
      board: ["Ts", "9h", "8c"],
    }),
  });

  const result = await response.json();
  console.log(result.players.map((player) => player.winChance)); // [0.65, 0.3]
}

getOdds();
```

## Runtime Considerations

- Each calculation runs in a worker thread; up to `maxConcurrentRequests` of
  them run at once
- Odds calculations can be computationally intensive: exhaustive pre-flop
  calculations can take a minute or more

## License

MIT License - see the [LICENSE](../../LICENSE) file for details.
