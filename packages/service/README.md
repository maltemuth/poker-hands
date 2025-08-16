# @malte.muth/poker-hands-service

[![npm](https://img.shields.io/npm/v/@malte.muth/poker-hands-service)](https://www.npmjs.com/package/@malte.muth/poker-hands-service)
[![npm](https://img.shields.io/npm/dt/@malte.muth/poker-hands-service)](https://www.npmjs.com/package/@malte.muth/poker-hands-service)
[![CI](https://img.shields.io/github/actions/workflow/status/malte-muth/poker-hands/ci.yml?branch=main)](https://github.com/malte-muth/poker-hands/actions/workflows/ci.yml)

A REST API and WebSocket service for Texas Hold'em poker hand evaluation, odds calculation, and more. Built on Express.js with TypeScript.

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
import {
  PokerHandsService,
  createService,
} from "@malte.muth/poker-hands-service";

// Option 1: Using the class directly
const service = new PokerHandsService({ port: 3000 });
service.start();

// Option 2: Using the convenience function
const service = createService({ port: 3000 });
// Service starts automatically
```

## API Endpoints

The service provides REST API endpoints for all poker calculations.

### Best Hand Evaluation

**POST** `/api/best-hand`

Get the best possible poker hand from a set of cards.

**Request Body:**

```json
{
  "cards": ["Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "hand": {
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
      // ... other possible hands
    ]
  },
  "timestamp": "2023-12-07T10:00:00.000Z"
}
```

### Hand Comparison

**POST** `/api/compare`

Compare two poker hands to determine which is better.

**Request Body:**

```json
{
  "hand1": ["Ah", "Kh", "Qh", "Jh", "Th"],
  "hand2": ["As", "Ad", "Ac", "Ks", "Kd"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "result": "hand1",
    "hands": {
      "hand1": {
        "type": "royalFlush",
        "cards": ["Ah", "Kh", "Qh", "Jh", "Th"],
        "rank": 10
      },
      "hand2": {
        "type": "fullHouse",
        "cards": ["As", "Ad", "Ac", "Ks", "Kd"],
        "rank": 7
      }
    }
  },
  "timestamp": "2023-12-07T10:00:00.000Z"
}
```

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

### Hand Percentages

**POST** `/api/percentages`

Calculate hand type percentages for given hole cards and board.

**Request Body:**

```json
{
  "cards": ["Ah", "Kh"],
  "board": ["Ts", "9h", "8c"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
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
  "timestamp": "2023-12-07T10:00:00.000Z"
}
```

### Service Information

**GET** `/api/info`

Get information about the service.

**Response:**

```json
{
  "success": true,
  "data": {
    "name": "Poker Hands Service",
    "version": "0.1.0",
    "description": "Service for poker hand evaluation, comparison, and odds calculation",
    "endpoints": {
      "POST /api/best-hand": "Get the best possible hand from a set of cards",
      "POST /api/compare": "Compare two poker hands",
      "POST /api/odds": "Calculate winning odds for hole cards and board",
      "POST /api/percentages": "Calculate hand type percentages",
      "GET /api/info": "Service information",
      "GET /health": "Health check"
    },
    "websocket": "ws://localhost:3000 (real-time calculations)"
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

## WebSocket Support

The service also provides WebSocket support for real-time poker calculations.

### Connection

```javascript
const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
  console.log("Connected to Poker Hands Service");
};

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log("Received:", response);
};

// Send a message for real-time calculation
ws.send(
  JSON.stringify({
    type: "bestHand",
    data: {
      cards: ["Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h"],
    },
  })
);
```

### WebSocket Messages

#### Best Hand Request

```json
{
  "type": "bestHand",
  "data": {
    "cards": ["Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h"]
  }
}
```

#### Odds Request

```json
{
  "type": "odds",
  "data": {
    "holes": [
      ["Ah", "Kh"],
      ["7c", "2d"]
    ],
    "board": ["Ts", "9h", "8c"]
  }
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
  cors: {
    origin: ["http://localhost:3000", "http://localhost:8080"],
    methods: ["GET", "POST"],
  },
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
- Supports multiple origins and methods

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
# Best hand evaluation
curl -X POST http://localhost:3000/api/best-hand \
  -H "Content-Type: application/json" \
  -d '{"cards": ["Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h"]}'

# Hand comparison
curl -X POST http://localhost:3000/api/compare \
  -H "Content-Type: application/json" \
  -d '{"hand1": ["Ah", "Kh", "Qh", "Jh", "Th"], "hand2": ["As", "Ad", "Ac", "Ks", "Kd"]}'

# Odds calculation
curl -X POST http://localhost:3000/api/odds \
  -H "Content-Type: application/json" \
  -d '{"holes": [["Ah", "Kh"], ["7c", "2d"]], "board": ["Ts", "9h", "8c"]}'
```

### Using with JavaScript/Node.js

```javascript
const fetch = require("node-fetch");

// Best hand evaluation
async function getBestHand() {
  const response = await fetch("http://localhost:3000/api/best-hand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cards: ["Ah", "Kh", "Qh", "Jh", "Th", "9h", "8h"],
    }),
  });

  const result = await response.json();
  console.log(result.data.hand.type); // 'royalFlush'
}

getBestHand();
```

### Using with Python

```python
import requests
import json

# Best hand evaluation
def get_best_hand():
    response = requests.post(
        'http://localhost:3000/api/best-hand',
        json={'cards': ['Ah', 'Kh', 'Qh', 'Jh', 'Th', '9h', '8h']}
    )

    result = response.json()
    print(result['data']['hand']['type'])  # 'royalFlush'

get_best_hand()
```

## Performance Considerations

- The service uses the underlying poker-hands library for calculations
- Odds calculations can be computationally intensive
- Consider using timeouts for long-running calculations
- The service includes built-in error handling and validation

## TypeScript Support

The service is written in TypeScript with comprehensive type definitions:

```typescript
import type {
  PokerHandsService,
  ServiceConfig,
} from "@malte.muth/poker-hands-service";

// All types are available for your TypeScript projects
```

## Contributing

Please read the [main contributing guidelines](../../CONTRIBUTING.md) for details on how to contribute to this project.

## License

MIT License - see the [LICENSE](../../LICENSE) file for details.
