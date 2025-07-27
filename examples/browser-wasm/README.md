# Browser WASM Example

This example demonstrates how to use the Rust WASM implementation to create a Card in the browser.

## Setup

1. Build the WASM module:

   ```sh
   yarn build:wasm:web
   ```

2. Start a local server (if needed):

   ```sh
   cd examples/browser-wasm
   npm install -g http-server
   http-server
   ```

3. Open the example in your browser:
   http://localhost:8080

This will display the details of a card created using the Rust WASM implementation.
