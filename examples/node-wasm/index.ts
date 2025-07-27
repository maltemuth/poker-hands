import { Card, Hand } from "../../src/rust/node/poker_hands";

// Initialize the WASM module
async function run() {
  // Create cards using the Rust implementation
  const cards = [
    Card.from_str("Ah"),
    Card.from_str("Kh"),
    Card.from_str("Qh"),
    Card.from_str("Jh"),
    Card.from_str("Th"),
    Card.from_str("9h"),
    Card.from_str("8s"),
  ];

  // Create a hand and check for a flush
  const hand = Hand.new(cards);
  const hasFlush = hand.has_flush();
  const flush = hand.get_flush();

  // Output the result
  console.log(`Has Flush: ${hasFlush}`);
  console.log(
    `Flush cards: ${flush.map((card) => card.to_string()).join(", ")}`
  );

  // Check for a straight
  const hasStraight = hand.has_straight();
  const straight = hand.get_straight();

  // Output the result
  console.log(`Has Straight: ${hasStraight}`);
  console.log(
    `Straight cards: ${straight.map((card) => card.to_string()).join(", ")}`
  );

  // Check for a straight flush
  const hasStraightFlush = hand.has_straight_flush();
  const straightFlush = hand.get_straight_flush();

  // Output the result
  console.log(`Has Straight Flush: ${hasStraightFlush}`);
  console.log(
    `Straight Flush cards: ${straightFlush
      .map((card) => card.to_string())
      .join(", ")}`
  );
}

run().catch(console.error);
