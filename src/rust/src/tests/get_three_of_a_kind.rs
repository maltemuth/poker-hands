use super::super::card::Card;
use super::super::hand::Hand;
use wasm_bindgen::prelude::*;
use wasm_bindgen_test::*;

#[wasm_bindgen_test]
fn test_get_three_of_a_kind() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Queen),
    ];

    let hand_obj = Hand::new(hand);
    let three_of_a_kind = hand_obj.get_three_of_a_kind();

    assert_eq!(three_of_a_kind.len(), 3);
    for card in &three_of_a_kind {
        assert_eq!(card.value(), crate::card::Value::Ten);
    }
}

#[wasm_bindgen_test]
fn test_get_three_of_a_kind_not_found() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Queen),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::King),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ace),
    ];

    let hand_obj = Hand::new(hand);
    let three_of_a_kind = hand_obj.get_three_of_a_kind();

    assert_eq!(three_of_a_kind.len(), 0);
}
