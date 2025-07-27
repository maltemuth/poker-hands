import { Card } from "../../src/rust/node/poker_hands";

// Initialize the WASM module
async function run() {
  // Create a card using the Rust implementation
  const card = Card.from_str("Ah");

  // Output the card details
  console.log(`Card: ${card.to_string()}`);
  console.log(`Suit: ${card.suit()}`);
  console.log(`Value: ${card.value()}`);
}

run().catch(console.error);
