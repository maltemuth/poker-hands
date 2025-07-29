use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen_test::*;

#[wasm_bindgen_test]
fn test_get_two_pair() {
    let cards = vec![
        Card::new(2, "hearts").unwrap(),
        Card::new(2, "diamonds").unwrap(),
        Card::new(3, "clubs").unwrap(),
        Card::new(3, "spades").unwrap(),
        Card::new(4, "hearts").unwrap(),
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
        Card::new(2, "hearts").unwrap(),
        Card::new(2, "diamonds").unwrap(),
        Card::new(3, "clubs").unwrap(),
        Card::new(4, "spades").unwrap(),
        Card::new(5, "hearts").unwrap(),
    ];
    let hand = Hand::new(cards);

    let two_pair = hand.get_two_pair();
    assert!(two_pair.is_empty());
}
