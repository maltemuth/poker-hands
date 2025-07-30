use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_has_straight_flush() {
    // Test with a straight flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
        // Add some other cards
        Card::new(Suit::Diamonds, Value::Seven),
        Card::new(Suit::Clubs, Value::Eight),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());

    // Test without a straight flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Six),
        Card::new(Suit::Clubs, Value::Seven),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_straight_flush());

    // Test with a straight but not a flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Three),
        Card::new(Suit::Clubs, Value::Four),
        Card::new(Suit::Spades, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Clubs, Value::Seven),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_straight_flush());

    // Test with a flush but not a straight
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Hearts, Value::Eight),
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Clubs, Value::Seven),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_ace_low() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_ace_high() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Ten),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_multiple_suits() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Three),
        Card::new(Suit::Clubs, Value::Four),
        Card::new(Suit::Spades, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Diamonds, Value::Seven),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_gaps() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Seven),
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Hearts, Value::Ace),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_wrap_around() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_wrap_around_reversed() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::Two),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

// Additional edge case tests for the refactored implementation

#[test]
fn test_has_straight_flush_with_duplicates() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Hearts, Value::Five), // Duplicate
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Hearts, Value::Seven),
        Card::new(Suit::Hearts, Value::Eight),
        Card::new(Suit::Hearts, Value::Nine),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_minimum_cards() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Hearts, Value::Seven),
        Card::new(Suit::Hearts, Value::Eight),
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Hearts, Value::Ten),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_maximum_cards() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Hearts, Value::Seven),
        Card::new(Suit::Hearts, Value::Eight),
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_edge_case_royal() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_edge_case_low_end() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_consecutive_duplicates() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Hearts, Value::Five), // Duplicate
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Hearts, Value::Six), // Duplicate
        Card::new(Suit::Hearts, Value::Seven),
        Card::new(Suit::Hearts, Value::Seven), // Duplicate
        Card::new(Suit::Hearts, Value::Eight),
        Card::new(Suit::Hearts, Value::Eight), // Duplicate
        Card::new(Suit::Hearts, Value::Nine),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_no_duplicates_but_gaps() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Hearts, Value::Seven), // Gap at 6
        Card::new(Suit::Hearts, Value::Eight),
        Card::new(Suit::Hearts, Value::Nine),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_multiple_suits_with_flush() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Hearts, Value::Seven), // Gap at 6
        Card::new(Suit::Diamonds, Value::Six), // Different suit
        Card::new(Suit::Diamonds, Value::Eight),
        Card::new(Suit::Diamonds, Value::Nine),
        Card::new(Suit::Diamonds, Value::Ten),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_straight_flush());
}

#[test]
fn test_has_straight_flush_with_extra_cards() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Seven), // Extra card
        Card::new(Suit::Clubs, Value::Ace),      // Extra card
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_straight_flush());
}
