use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen_test::*;

#[wasm_bindgen_test]
fn test_has_two_pair() {
    let cards = vec![
        Card::new(2, "hearts").unwrap(),
        Card::new(2, "diamonds").unwrap(),
        Card::new(3, "clubs").unwrap(),
        Card::new(3, "spades").unwrap(),
        Card::new(4, "hearts").unwrap(),
    ];
    let hand = Hand::new(cards);

    assert!(hand.has_two_pair());
}

#[wasm_bindgen_test]
fn test_does_not_have_two_pair() {
    let cards = vec![
        Card::new(2, "hearts").unwrap(),
        Card::new(2, "diamonds").unwrap(),
        Card::new(3, "clubs").unwrap(),
        Card::new(4, "spades").unwrap(),
        Card::new(5, "hearts").unwrap(),
    ];
    let hand = Hand::new(cards);

    assert!(!hand.has_two_pair());
}
