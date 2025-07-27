# Example Directory Structure and Content

## Node.js/TypeScript Example

### Directory: `examples/node-wasm`

#### README.md

````markdown
# Node.js WASM Example

This example demonstrates how to use the Rust WASM implementation to create a Card in Node.js with TypeScript.

## Setup

1. Build the WASM module:
   ```sh
   yarn build:wasm:node
   ```
````

## Usage

1. Run the example:
   ```sh
   yarn example:node
   ```

This will output the details of a card created using the Rust WASM implementation.

````

#### index.ts
```typescript
import * as fs from 'fs';
import * as path from 'path';
import { Card, Suit, Value } from 'poker-hands-rust';

// Load the WASM module
const wasmPath = path.resolve(__dirname, '..', '..', 'src', 'rust', 'pkg', 'poker_hands_bg.wasm');
const wasmBuffer = fs.readFileSync(wasmPath);

// Initialize the WASM module
const wasmModule = new WebAssembly.Module(wasmBuffer);
const wasmInstance = new WebAssembly.Instance(wasmModule, {
  // Import any necessary JS functions here
});

// Create a card using the Rust implementation
const card = Card.new(Suit.Hearts, Value.Ace);

// Output the card details
console.log(`Card: ${card.toString()}`);
console.log(`Suit: ${card.suit()}`);
console.log(`Value: ${card.value()}`);
````

## Browser Example

### Directory: `examples/browser-wasm`

#### README.md

````markdown
# Browser WASM Example

This example demonstrates how to use the Rust WASM implementation to create a Card in the browser.

## Setup

1. Build the WASM module:
   ```sh
   yarn build:wasm:web
   ```
````

2. Start a local server (if needed):

   ```sh
   cd examples/browser-wasm
   npm install -g http-server
   http-server
   ```

3. Open the example in your browser:
   http://localhost:8080

This will display the details of a card created using the Rust WASM implementation.

````

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WASM Card Example</title>
</head>
<body>
  <h1>WASM Card Example</h1>
  <div id="card-details"></div>

  <script>
    async function loadWasm() {
      const response = await fetch('/path/to/poker_hands_bg.wasm');
      const buffer = await response.arrayBuffer();
      const wasmModule = await WebAssembly.instantiate(buffer, {
        // Import any necessary JS functions here
      });

      // Create a card using the Rust implementation
      const card = wasmModule.exports.Card.new(wasmModule.exports.Suit.Hearts, wasmModule.exports.Value.Ace);

      // Output the card details
      const cardDetails = document.getElementById('card-details');
      cardDetails.innerHTML = `
        <p>Card: ${card.toString()}</p>
        <p>Suit: ${card.suit()}</p>
        <p>Value: ${card.value()}</p>
      `;
    }

    loadWasm();
  </script>
</body>
</html>
````

#### package.json

```json
{
  "name": "browser-wasm",
  "version": "1.0.0",
  "scripts": {
    "start": "http-server"
  },
  "devDependencies": {
    "http-server": "^0.14.1"
  }
}
```
