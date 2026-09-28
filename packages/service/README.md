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
  maxConcurrentRequests?: number; // Maximum concurrent requests (default: 5, range: 1-100)
}
```

### Example Configuration

```typescript
import { PokerHandsService } from "@malte.muth/poker-hands-service";

const service = new PokerHandsService({
  port: 8080,
  cors: true,
  maxConcurrentRequests: 10,
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
