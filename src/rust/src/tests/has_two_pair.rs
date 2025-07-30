use crate::card::Card;
use crate::hand::Hand;

#[test]
fn test_has_two_pair() {
    let cards = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Two),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Two),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Three),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Three),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Four),
    ];
    let hand = Hand::new(cards);

    assert!(hand.has_two_pair());
}

#[test]
fn test_does_not_have_two_pair() {
    let cards = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Two),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Two),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Three),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Four),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Five),
    ];
    let hand = Hand::new(cards);

    assert!(!hand.has_two_pair());
}
