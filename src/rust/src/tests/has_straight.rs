use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_has_straight() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Three),
        Card::new(Suit::Clubs, Value::Four),
        Card::new(Suit::Spades, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Diamonds, Value::Seven),
        Card::new(Suit::Clubs, Value::Eight),
    ];
    let hand = Hand::new(hand);
    assert!(hand.has_straight());
}

#[test]
fn test_has_straight_with_ace_as_one() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Diamonds, Value::Jack),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
    ];
    let hand = Hand::new(hand);
    assert!(hand.has_straight());
}

#[test]
fn test_does_not_have_straight() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Four),
        Card::new(Suit::Clubs, Value::Six),
        Card::new(Suit::Spades, Value::Eight),
        Card::new(Suit::Hearts, Value::Ten),
    ];
    let hand = Hand::new(hand);
    assert!(!hand.has_straight());
}
