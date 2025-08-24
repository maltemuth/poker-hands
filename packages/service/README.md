# @malte.muth/poker-hands-service

[![npm](https://img.shields.io/npm/v/@malte.muth/poker-hands-service)](https://www.npmjs.com/package/@malte.muth/poker-hands-service)
[![npm](https://img.shields.io/npm/dt/@malte.muth/poker-hands-service)](https://www.npmjs.com/package/@malte.muth/poker-hands-service)

A REST API service for Texas Hold'em poker odds calculation. Built on Express.js with TypeScript.

This package is almost entirely AI-generated.

## Installation

```bash
npm install @malte.muth/poker-hands-service
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
  "board": ["Ts", "9h", "8c"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "winProbabilities": [0.65, 0.35],
    "handTypeProbabilities": [
      {
        "highCard": 0.15,
        "pair": 0.25,
        "twoPair": 0.1,
        "threeOfAKind": 0.05,
        "straight": 0.2,
        "flush": 0.15,
        "fullHouse": 0.05,
        "fourOfAKind": 0.02,
        "straightFlush": 0.02,
        "royalFlush": 0.01
      },
      {
        "highCard": 0.25,
        "pair": 0.3,
        "twoPair": 0.15,
        "threeOfAKind": 0.08,
        "straight": 0.1,
        "flush": 0.08,
        "fullHouse": 0.03,
        "fourOfAKind": 0.01,
        "straightFlush": 0.0,
        "royalFlush": 0.0
      }
    ]
  },
  "timestamp": "2023-12-07T10:00:00.000Z"
}
```

### Health Check

**GET** `/health`

Health check endpoint.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2023-12-07T10:00:00.000Z"
  },
  "timestamp": "2023-12-07T10:00:00.000Z"
}
```

## Configuration

### PokerHandsService Options

```typescript
interface ServiceConfig {
  port?: number; // Server port (default: 3000)
  cors?: boolean; // Enable CORS (default: true)
}
```

### Example Configuration

```typescript
import { PokerHandsService } from "@malte.muth/poker-hands-service";

const service = new PokerHandsService({
  port: 8080,
  cors: true,
});
```

## Error Handling

The service provides consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2023-12-07T10:00:00.000Z"
}
```

### Common Error Codes

- `400 Bad Request`: Invalid input data
- `500 Internal Server Error`: Server error during processing

## Middleware

The service includes built-in middleware:

### Validation Middleware

- Validates card format and values
- Validates request structure
- Provides detailed error messages

### CORS Middleware

- Configurable cross-origin resource sharing
- Supports enabling/disabling CORS

## CLI Dependency

The service relies on executing CLI commands rather than directly using the poker library. When you make requests to the API endpoints, the service internally executes CLI commands like `npx poker-hands odds` to perform the calculations. This means you need to ensure the CLI package is properly installed and available in the system PATH.

## Development

### Running in Development Mode

```bash
# Install dependencies
npm install

# Run in development mode (with ts-node)
npm run dev

# Build the service
npm run build

# Run the built service
npm start
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
const fetch = require("node-fetch");

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
  console.log(result.data.winProbabilities); // [0.65, 0.35]
}

getOdds();
```

## Runtime Considerations

- The service executes CLI commands to perform poker calculations
- Odds calculations can be computationally intensive

## License

MIT License - see the [LICENSE](../../LICENSE) file for details.
