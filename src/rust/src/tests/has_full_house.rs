use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[test]
fn test_has_full_house() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Jack).unwrap(),
    ];

    let hand_obj = Hand::new(hand);
    assert!(hand_obj.has_full_house());
}

#[test]
fn test_does_not_have_full_house() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Queen).unwrap(),
    ];

    let hand_obj = Hand::new(hand);
    assert!(!hand_obj.has_full_house());
}
