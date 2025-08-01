import { Card, Hand } from "../../src/rust/node/poker_hands";

// Initialize the WASM module
async function run() {
  // Test getBestHand
  const bestHandCards = [
    Card.from_str("Ah"),
    Card.from_str("Kh"),
    Card.from_str("Qh"),
    Card.from_str("As"),
    Card.from_str("Th"),
  ];
  const bestHand = Hand.new(bestHandCards);
  const bestHandResult = bestHand.get_best_hand();

  // Output the result
  console.log(
    `Best Hand: ${bestHandResult
      .cards()
      .map((card: Card) => card.to_string())
      .join(", ")}`
  );
}

run().catch(console.error);
