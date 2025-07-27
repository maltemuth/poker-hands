use crate::card::Card;
use crate::hand::Hand;

#[test]
fn test_has_flush() {
    // Create a hand with a flush
    let cards = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ace),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::King),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Queen),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Nine),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Eight),
    ];

    let hand = Hand::new(cards);
    assert!(hand.has_flush());

    // Create a hand without a flush
    let cards = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ace),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::King),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Queen),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Nine),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Eight),
    ];

    let hand = Hand::new(cards);
    assert!(!hand.has_flush());
}
