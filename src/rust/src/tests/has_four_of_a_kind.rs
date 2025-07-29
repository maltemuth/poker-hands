use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_has_four_of_a_kind() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Two),
        Card::new(Suit::Spades, Value::Two),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_four_of_a_kind());
}

#[test]
fn test_does_not_have_four_of_a_kind() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Two),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
        Card::new(Suit::Clubs, Value::Ace),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_four_of_a_kind());
}
