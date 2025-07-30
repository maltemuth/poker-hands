use super::super::card::Card;
use super::super::hand::Hand;

#[test]
fn test_has_three_of_a_kind() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Queen),
    ];

    let hand_obj = Hand::new(hand);
    assert!(hand_obj.has_three_of_a_kind());
}

#[test]
fn test_does_not_have_three_of_a_kind() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Queen),
    ];

    let hand_obj = Hand::new(hand);
    assert!(!hand_obj.has_three_of_a_kind());
}
