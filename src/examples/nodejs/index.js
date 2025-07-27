const { Card, Suit, Value } = require("poker-hands");

const card = Card.new(Suit.Hearts, Value.Ace);
console.log(`Created card: ${card.toString()}`);

const cardFromStr = Card.from_str("King Spades");
if (cardFromStr.is_ok()) {
  console.log(`Created card from string: ${cardFromStr.unwrap().toString()}`);
} else {
  console.error(`Failed to create card from string: ${cardFromStr.err()}`);
}
