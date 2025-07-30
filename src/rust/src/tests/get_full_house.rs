use crate::card::Card;
use crate::hand::Hand;

#[test]
fn test_get_full_house() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Jack).unwrap(),
    ];

    let hand_obj = Hand::new(hand);
    let full_house = hand_obj.get_full_house();

    assert_eq!(full_house.len(), 5);
    assert_eq!(
        full_house
            .iter()
            .filter(|&c| c.value() == crate::card::Value::Ten)
            .count(),
        3
    );
    assert_eq!(
        full_house
            .iter()
            .filter(|&c| c.value() == crate::card::Value::Jack)
            .count(),
        2
    );
}

#[test]
fn test_get_full_house_empty() {
    let hand = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Ten).unwrap(),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack).unwrap(),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Queen).unwrap(),
    ];

    let hand_obj = Hand::new(hand);
    let full_house = hand_obj.get_full_house();

    assert!(full_house.is_empty());
}
