use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_get_straight() {
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
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    assert_eq!(straight[0].value(), Value::Eight);
    assert_eq!(straight[1].value(), Value::Seven);
    assert_eq!(straight[2].value(), Value::Six);
    assert_eq!(straight[3].value(), Value::Five);
    assert_eq!(straight[4].value(), Value::Four);
}

#[test]
fn test_get_straight_with_ace_as_one() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Diamonds, Value::Jack),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    assert_eq!(straight[0].value(), Value::Ace);
    assert_eq!(straight[1].value(), Value::King);
    assert_eq!(straight[2].value(), Value::Queen);
    assert_eq!(straight[3].value(), Value::Jack);
    assert_eq!(straight[4].value(), Value::Ten);
}

#[test]
fn test_get_straight_no_straight() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Four),
        Card::new(Suit::Clubs, Value::Six),
        Card::new(Suit::Spades, Value::Eight),
        Card::new(Suit::Hearts, Value::Ten),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 0);
}
