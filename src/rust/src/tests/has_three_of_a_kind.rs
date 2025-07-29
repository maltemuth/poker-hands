use super::super::card::Card;
use super::super::hand::Hand;
use wasm_bindgen::prelude::*;
use wasm_bindgen_test::*;

#[wasm_bindgen_test]
fn test_has_three_of_a_kind() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Queen).unwrap(),
    ];

    let hand_obj = Hand::new(hand);
    assert!(hand_obj.has_three_of_a_kind());
}

#[wasm_bindgen_test]
fn test_does_not_have_three_of_a_kind() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Jack).unwrap(),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Queen).unwrap(),
    ];

    let hand_obj = Hand::new(hand);
    assert!(!hand_obj.has_three_of_a_kind());
}
