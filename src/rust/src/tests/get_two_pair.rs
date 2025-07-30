use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen_test::*;

#[wasm_bindgen_test]
fn test_get_two_pair() {
    let cards = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Two),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Two),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Three),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Three),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Four),
    ];
    let hand = Hand::new(cards);

    let two_pair = hand.get_two_pair();
    assert_eq!(two_pair.len(), 4);
    assert_eq!(two_pair[0].value(), two_pair[1].value());
    assert_eq!(two_pair[2].value(), two_pair[3].value());
    assert_ne!(two_pair[0].value(), two_pair[2].value());
}

#[wasm_bindgen_test]
fn test_get_two_pair_empty() {
    let cards = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Two),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Two),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Three),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Four),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Five),
    ];
    let hand = Hand::new(cards);

    let two_pair = hand.get_two_pair();
    assert!(two_pair.is_empty());
}
