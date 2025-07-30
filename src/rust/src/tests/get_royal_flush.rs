use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_get_royal_flush() {
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
    let royal_flush = hand.get_royal_flush();

    // Should return 5 cards
    assert_eq!(royal_flush.len(), 5);

    // All cards should be hearts
    for card in royal_flush.cards() {
        assert_eq!(card.suit(), Suit::Hearts);
    }

    // Should contain the royal flush cards in the correct order (Ace high)
    assert_eq!(royal_flush.cards()[0].value(), Value::Ace);
    assert_eq!(royal_flush.cards()[1].value(), Value::King);
    assert_eq!(royal_flush.cards()[2].value(), Value::Queen);
    assert_eq!(royal_flush.cards()[3].value(), Value::Jack);
    assert_eq!(royal_flush.cards()[4].value(), Value::Ten);

    // Should have no kickers
    assert_eq!(royal_flush.kickers().len(), 0);
}

#[test]
fn test_get_royal_flush_with_minimum_cards() {
    // Test with exactly 5 cards that form a royal flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
    ];

    let hand = Hand::new(cards);
    let royal_flush = hand.get_royal_flush();

    // Should return 5 cards
    assert_eq!(royal_flush.len(), 5);

    // Should contain the royal flush cards in the correct order (Ace high)
    assert_eq!(royal_flush.cards()[0].value(), Value::Ace);
    assert_eq!(royal_flush.cards()[1].value(), Value::King);
    assert_eq!(royal_flush.cards()[2].value(), Value::Queen);
    assert_eq!(royal_flush.cards()[3].value(), Value::Jack);
    assert_eq!(royal_flush.cards()[4].value(), Value::Ten);
}

#[test]
fn test_get_royal_flush_all_suits() {
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
        let royal_flush = hand.get_royal_flush();

        // Should return 5 cards
        assert_eq!(royal_flush.len(), 5);

        // All cards should be of the correct suit
        for card in royal_flush.cards() {
            assert_eq!(card.suit(), *suit);
        }

        // Should contain the royal flush cards in the correct order (Ace high)
        assert_eq!(royal_flush.cards()[0].value(), Value::Ace);
        assert_eq!(royal_flush.cards()[1].value(), Value::King);
        assert_eq!(royal_flush.cards()[2].value(), Value::Queen);
        assert_eq!(royal_flush.cards()[3].value(), Value::Jack);
        assert_eq!(royal_flush.cards()[4].value(), Value::Ten);
    }
}

#[test]
fn test_get_royal_flush_no_royal_flush() {
    // Test when there's no royal flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
    ];

    let hand = Hand::new(cards);
    let royal_flush = hand.get_royal_flush();

    // Should return 0 cards (empty result)
    assert_eq!(royal_flush.len(), 0);

    // Should have no cards
    assert_eq!(royal_flush.cards().len(), 0);

    // Should have no kickers
    assert_eq!(royal_flush.kickers().len(), 0);
}
