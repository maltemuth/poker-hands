use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_has_royal_flush() {
    // Test with a royal flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
        // Add some other cards
        Card::new(Suit::Diamonds, Value::Seven),
        Card::new(Suit::Clubs, Value::Eight),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_royal_flush());

    // Test without a royal flush (missing Ace)
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Diamonds, Value::Seven),
        Card::new(Suit::Clubs, Value::Eight),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_royal_flush());

    // Test without a royal flush (different suits)
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Diamonds, Value::Jack),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Seven),
        Card::new(Suit::Clubs, Value::Eight),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_royal_flush());
}

#[test]
fn test_has_royal_flush_with_minimum_cards() {
    // Test with exactly 5 cards that form a royal flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_royal_flush());
}

#[test]
fn test_has_royal_flush_with_fewer_than_five_cards() {
    // Test with fewer than 5 cards (impossible to have a royal flush)
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_royal_flush());
}

#[test]
fn test_has_royal_flush_with_duplicates() {
    // Test with duplicate cards that still form a royal flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Ten), // Duplicate
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_royal_flush());
}

#[test]
fn test_has_royal_flush_all_suits() {
    // Test royal flush with each suit
    let suits = [Suit::Hearts, Suit::Diamonds, Suit::Clubs, Suit::Spades];

    for suit in &suits {
        let cards = vec![
            Card::new(*suit, Value::Ten),
            Card::new(*suit, Value::Jack),
            Card::new(*suit, Value::Queen),
            Card::new(*suit, Value::King),
            Card::new(*suit, Value::Ace),
        ];

        let hand = Hand::new(cards);
        assert!(hand.has_royal_flush());
    }
}

#[test]
fn test_has_royal_flush_not_straight_flush() {
    // Test that a straight flush that is not a royal flush returns false
    let cards = vec![
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_royal_flush());
}
