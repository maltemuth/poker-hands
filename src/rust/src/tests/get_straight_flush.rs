use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_get_straight_flush() {
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
    let straight_flush = hand.get_straight_flush();
    assert_eq!(straight_flush.len(), 5);
    assert_eq!(straight_flush[0].suit(), Suit::Hearts);
    assert_eq!(straight_flush[0].value(), Value::Two);
    assert_eq!(straight_flush[1].value(), Value::Three);
    assert_eq!(straight_flush[2].value(), Value::Four);
    assert_eq!(straight_flush[3].value(), Value::Five);
    assert_eq!(straight_flush[4].value(), Value::Six);

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
    let straight_flush = hand.get_straight_flush();
    assert!(straight_flush.is_empty());

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
    let straight_flush = hand.get_straight_flush();
    assert!(straight_flush.is_empty());

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
    let straight_flush = hand.get_straight_flush();
    assert!(straight_flush.is_empty());
}
