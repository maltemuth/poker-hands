use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_has_pair() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Three),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
    ];
    let hand = Hand::new(cards);

    assert!(hand.has_pair());
}

#[test]
fn test_no_pair() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Three),
        Card::new(Suit::Clubs, Value::Four),
        Card::new(Suit::Spades, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
    ];
    let hand = Hand::new(cards);

    assert!(!hand.has_pair());
}
