# WASM Examples Plan

## Node.js/TypeScript Example

1. Create a directory: `examples/node-wasm`
2. Create a README.md with instructions
3. Create an `index.ts` file with code to:
   - Load the WASM module
   - Create a Card using the Rust implementation
   - Output the card details

## Browser Example

1. Create a directory: `examples/browser-wasm`
2. Create a README.md with instructions
3. Create an `index.html` file with:
   - Script to load the WASM module
   - JavaScript to create a Card using the Rust implementation
   - Display the card details on the page

## Build Chain Updates

1. Update the main package.json to include scripts for building and running the examples
2. Ensure the Rust WASM build outputs are properly linked to the examples
