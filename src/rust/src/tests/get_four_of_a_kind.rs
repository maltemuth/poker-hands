use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_get_four_of_a_kind() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Two),
        Card::new(Suit::Spades, Value::Two),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
    ];

    let hand = Hand::new(cards);
    let four_of_a_kind = hand.get_four_of_a_kind();

    assert_eq!(four_of_a_kind.len(), 4);
    for card in &four_of_a_kind {
        assert_eq!(card.value(), Value::Two);
    }
}

#[test]
fn test_get_four_of_a_kind_not_found() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Two),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
        Card::new(Suit::Clubs, Value::Ace),
    ];

    let hand = Hand::new(cards);
    let four_of_a_kind = hand.get_four_of_a_kind();

    assert!(four_of_a_kind.is_empty());
}
