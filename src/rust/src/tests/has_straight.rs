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

#[test]
fn test_has_straight_with_ace_low() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Three),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
    ];
    let hand = Hand::new(hand);
    assert!(hand.has_straight());
}

#[test]
fn test_has_straight_with_ace_high() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::King),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::Jack),
        Card::new(Suit::Hearts, Value::Ten),
    ];
    let hand = Hand::new(hand);
    assert!(hand.has_straight());
}

#[test]
fn test_has_straight_with_ace_in_middle() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Diamonds, Value::Ace),
        Card::new(Suit::Clubs, Value::Eleven),
        Card::new(Suit::Spades, Value::Twelve),
        Card::new(Suit::Hearts, Value::Thirteen),
    ];
    let hand = Hand::new(hand);
    assert!(hand.has_straight());
}

#[test]
fn test_has_multiple_straights() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Three),
        Card::new(Suit::Clubs, Value::Four),
        Card::new(Suit::Spades, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Diamonds, Value::Seven),
        Card::new(Suit::Clubs, Value::Eight),
        Card::new(Suit::Spades, Value::Nine),
    ];
    let hand = Hand::new(hand);
    assert!(hand.has_straight());
}

#[test]
fn test_almost_straight() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Three),
        Card::new(Suit::Clubs, Value::Five), // Missing Four
        Card::new(Suit::Spades, Value::Six),
        Card::new(Suit::Hearts, Value::Seven),
    ];
    let hand = Hand::new(hand);
    assert!(!hand.has_straight());
}

#[test]
fn test_straight_with_gaps() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Four),
        Card::new(Suit::Clubs, Value::Seven),
        Card::new(Suit::Spades, Value::Nine),
        Card::new(Suit::Hearts, Value::Ace),
    ];
    let hand = Hand::new(hand);
    assert!(!hand.has_straight());
}

#[test]
fn test_straight_with_ace_wrap_around() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Three),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Six),
    ];
    let hand = Hand::new(hand);
    assert!(hand.has_straight());
}

#[test]
fn test_straight_with_ace_wrap_around_reversed() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Diamonds, Value::Jack),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Two),
    ];
    let hand = Hand::new(hand);
    assert!(hand.has_straight());
}
