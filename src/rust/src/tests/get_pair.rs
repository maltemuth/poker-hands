use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_get_pair() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Three),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
    ];
    let hand = Hand::new(cards);

    let pair = hand.get_pair();
    assert_eq!(pair.cards().len(), 2);
    assert_eq!(pair.cards()[0].value(), Value::Two);
    assert_eq!(pair.cards()[1].value(), Value::Two);
}

#[test]
fn test_get_pair_no_pair() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Three),
        Card::new(Suit::Clubs, Value::Four),
        Card::new(Suit::Spades, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
    ];
    let hand = Hand::new(cards);

    let pair = hand.get_pair();
    assert!(pair.cards().is_empty());
}
