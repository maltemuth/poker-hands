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
    assert_eq!(straight.cards()[0].value(), Value::Eight);
    assert_eq!(straight.cards()[1].value(), Value::Seven);
    assert_eq!(straight.cards()[2].value(), Value::Six);
    assert_eq!(straight.cards()[3].value(), Value::Five);
    assert_eq!(straight.cards()[4].value(), Value::Four);
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
    assert_eq!(straight.cards()[0].value(), Value::Ace);
    assert_eq!(straight.cards()[1].value(), Value::King);
    assert_eq!(straight.cards()[2].value(), Value::Queen);
    assert_eq!(straight.cards()[3].value(), Value::Jack);
    assert_eq!(straight.cards()[4].value(), Value::Ten);
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

#[test]
fn test_get_straight_with_ace_low() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Three),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    assert_eq!(straight.cards()[0].value(), Value::Five);
    assert_eq!(straight.cards()[1].value(), Value::Four);
    assert_eq!(straight.cards()[2].value(), Value::Three);
    assert_eq!(straight.cards()[3].value(), Value::Two);
    assert_eq!(straight.cards()[4].value(), Value::Ace);
}

#[test]
fn test_get_straight_with_ace_high() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::King),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::Jack),
        Card::new(Suit::Hearts, Value::Ten),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    assert_eq!(straight.cards()[0].value(), Value::Ace);
    assert_eq!(straight.cards()[1].value(), Value::King);
    assert_eq!(straight.cards()[2].value(), Value::Queen);
    assert_eq!(straight.cards()[3].value(), Value::Jack);
    assert_eq!(straight.cards()[4].value(), Value::Ten);
}

#[test]
fn test_get_straight_with_multiple_straights() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Three),
        Card::new(Suit::Clubs, Value::Four),
        Card::new(Suit::Spades, Value::Five),
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Diamonds, Value::Seven),
        Card::new(Suit::Clubs, Value::Eight),
        Card::new(Suit::Spades, Value::Nine),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    assert_eq!(straight.cards()[0].value(), Value::Nine);
    assert_eq!(straight.cards()[1].value(), Value::Eight);
    assert_eq!(straight.cards()[2].value(), Value::Seven);
    assert_eq!(straight.cards()[3].value(), Value::Six);
    assert_eq!(straight.cards()[4].value(), Value::Five);
}

#[test]
fn test_get_straight_with_gaps() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Two),
        Card::new(Suit::Diamonds, Value::Four),
        Card::new(Suit::Clubs, Value::Seven),
        Card::new(Suit::Spades, Value::Nine),
        Card::new(Suit::Hearts, Value::Ace),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 0);
}

#[test]
fn test_get_straight_with_wrap_around() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Three),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Six),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    assert_eq!(straight.cards()[0].value(), Value::Six);
    assert_eq!(straight.cards()[1].value(), Value::Five);
    assert_eq!(straight.cards()[2].value(), Value::Four);
    assert_eq!(straight.cards()[3].value(), Value::Three);
    assert_eq!(straight.cards()[4].value(), Value::Two);
}

#[test]
fn test_get_straight_with_wrap_around_reversed() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Diamonds, Value::Jack),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::King),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Two),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    assert_eq!(straight.cards()[0].value(), Value::Ace);
    assert_eq!(straight.cards()[1].value(), Value::King);
    assert_eq!(straight.cards()[2].value(), Value::Queen);
    assert_eq!(straight.cards()[3].value(), Value::Jack);
    assert_eq!(straight.cards()[4].value(), Value::Ten);
}

// Additional edge case tests for the refactored implementation

#[test]
fn test_get_straight_with_duplicates() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Five), // Duplicate
        Card::new(Suit::Clubs, Value::Six),
        Card::new(Suit::Spades, Value::Seven),
        Card::new(Suit::Hearts, Value::Eight),
        Card::new(Suit::Diamonds, Value::Nine),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    // Should return the highest straight: 9-8-7-6-5
    assert_eq!(straight.cards()[0].value(), Value::Nine);
    assert_eq!(straight.cards()[1].value(), Value::Eight);
    assert_eq!(straight.cards()[2].value(), Value::Seven);
    assert_eq!(straight.cards()[3].value(), Value::Six);
    assert_eq!(straight.cards()[4].value(), Value::Five);
}

#[test]
fn test_get_straight_with_multiple_options() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Three),
        Card::new(Suit::Diamonds, Value::Four),
        Card::new(Suit::Clubs, Value::Five),
        Card::new(Suit::Spades, Value::Six),
        Card::new(Suit::Hearts, Value::Seven),
        Card::new(Suit::Diamonds, Value::Eight),
        Card::new(Suit::Clubs, Value::Nine),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    // Should return the highest straight: 9-8-7-6-5
    assert_eq!(straight.cards()[0].value(), Value::Nine);
    assert_eq!(straight.cards()[1].value(), Value::Eight);
    assert_eq!(straight.cards()[2].value(), Value::Seven);
    assert_eq!(straight.cards()[3].value(), Value::Six);
    assert_eq!(straight.cards()[4].value(), Value::Five);
}

#[test]
fn test_get_straight_with_ace_low_and_high() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Two),
        Card::new(Suit::Clubs, Value::Three),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Ten),
        Card::new(Suit::Clubs, Value::Jack),
        Card::new(Suit::Spades, Value::Queen),
        Card::new(Suit::Hearts, Value::King),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    // Should return the highest straight: A-K-Q-J-10
    assert_eq!(straight.cards()[0].value(), Value::Ace);
    assert_eq!(straight.cards()[1].value(), Value::King);
    assert_eq!(straight.cards()[2].value(), Value::Queen);
    assert_eq!(straight.cards()[3].value(), Value::Jack);
    assert_eq!(straight.cards()[4].value(), Value::Ten);
}

#[test]
fn test_get_straight_with_suits_mixed() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Six),
        Card::new(Suit::Clubs, Value::Seven),
        Card::new(Suit::Spades, Value::Eight),
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Diamonds, Value::Ten),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    // Should return the highest straight: 10-9-8-7-6
    assert_eq!(straight.cards()[0].value(), Value::Ten);
    assert_eq!(straight.cards()[1].value(), Value::Nine);
    assert_eq!(straight.cards()[2].value(), Value::Eight);
    assert_eq!(straight.cards()[3].value(), Value::Seven);
    assert_eq!(straight.cards()[4].value(), Value::Six);
}

#[test]
fn test_get_straight_kickers_empty() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Six),
        Card::new(Suit::Clubs, Value::Seven),
        Card::new(Suit::Spades, Value::Eight),
        Card::new(Suit::Hearts, Value::Nine),
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.kickers().len(), 0);
}

#[test]
fn test_get_straight_kickers_with_extra_cards() {
    let hand = vec![
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Six),
        Card::new(Suit::Clubs, Value::Seven),
        Card::new(Suit::Spades, Value::Eight),
        Card::new(Suit::Hearts, Value::Nine),
        Card::new(Suit::Diamonds, Value::Two), // Extra card
        Card::new(Suit::Clubs, Value::Ace),    // Extra card
    ];
    let hand = Hand::new(hand);
    let straight = hand.get_straight();
    assert_eq!(straight.len(), 5);
    assert_eq!(straight.kickers().len(), 0); // straights never have kickers
}
