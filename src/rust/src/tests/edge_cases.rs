use crate::card::{Card, Suit, Value};
use crate::hand::Hand;

#[test]
fn test_royal_flush() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Ten),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::RoyalFlush
    );
}

#[test]
fn test_straight_flush_with_ace_low() {
    let cards = vec![
        Card::new(Suit::Spades, Value::Five),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Spades, Value::Three),
        Card::new(Suit::Spades, Value::Two),
        Card::new(Suit::Spades, Value::Ace),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::StraightFlush
    );
}

#[test]
fn test_straight_with_ace_low() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Diamonds, Value::Four),
        Card::new(Suit::Clubs, Value::Three),
        Card::new(Suit::Spades, Value::Two),
        Card::new(Suit::Hearts, Value::Ace),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::Straight
    );
}

#[test]
fn test_multiple_possible_hands_flush_and_straight() {
    // This hand has both a flush and a straight, should be identified as straight flush
    let cards = vec![
        Card::new(Suit::Hearts, Value::Seven),
        Card::new(Suit::Hearts, Value::Six),
        Card::new(Suit::Hearts, Value::Five),
        Card::new(Suit::Hearts, Value::Four),
        Card::new(Suit::Hearts, Value::Three),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::StraightFlush
    );
}

#[test]
fn test_high_card_hand() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::King),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::Jack),
        Card::new(Suit::Hearts, Value::Nine),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::HighCard
    );
}

#[test]
fn test_pair() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
        Card::new(Suit::Clubs, Value::King),
        Card::new(Suit::Spades, Value::Queen),
        Card::new(Suit::Hearts, Value::Jack),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(result.hand_type(), crate::hand::hand_types::HandType::Pair);
}

#[test]
fn test_two_pair() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
        Card::new(Suit::Clubs, Value::King),
        Card::new(Suit::Spades, Value::King),
        Card::new(Suit::Hearts, Value::Queen),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::TwoPair
    );
}

#[test]
fn test_three_of_a_kind() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
        Card::new(Suit::Clubs, Value::Ace),
        Card::new(Suit::Spades, Value::King),
        Card::new(Suit::Hearts, Value::Queen),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::ThreeOfAKind
    );
}

#[test]
fn test_full_house() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
        Card::new(Suit::Clubs, Value::Ace),
        Card::new(Suit::Spades, Value::King),
        Card::new(Suit::Hearts, Value::King),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::FullHouse
    );
}

#[test]
fn test_four_of_a_kind() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Ace),
        Card::new(Suit::Clubs, Value::Ace),
        Card::new(Suit::Spades, Value::Ace),
        Card::new(Suit::Hearts, Value::King),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::FourOfAKind
    );
}

#[test]
fn test_flush() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Nine),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(result.hand_type(), crate::hand::hand_types::HandType::Flush);
}

#[test]
fn test_straight() {
    let cards = vec![
        Card::new(Suit::Hearts, Value::Seven),
        Card::new(Suit::Diamonds, Value::Six),
        Card::new(Suit::Clubs, Value::Five),
        Card::new(Suit::Spades, Value::Four),
        Card::new(Suit::Hearts, Value::Three),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::Straight
    );
}

#[test]
fn test_straight_with_ace_high_and_low() {
    // Test a hand with Ace that can be both high and low
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::Five),
        Card::new(Suit::Clubs, Value::Four),
        Card::new(Suit::Spades, Value::Three),
        Card::new(Suit::Hearts, Value::Two),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    // Should be identified as straight (A-5-4-3-2)
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::Straight
    );
}

#[test]
fn test_duplicate_cards() {
    // Test with duplicate cards (should still work)
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Diamonds, Value::King),
        Card::new(Suit::Clubs, Value::Queen),
        Card::new(Suit::Spades, Value::Jack),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    // Should be identified as pair
    assert_eq!(result.hand_type(), crate::hand::hand_types::HandType::Pair);
}

#[test]
fn test_more_than_five_cards() {
    // Test with more than 5 cards (should pick the best 5)
    let cards = vec![
        Card::new(Suit::Hearts, Value::Ace),
        Card::new(Suit::Hearts, Value::King),
        Card::new(Suit::Hearts, Value::Queen),
        Card::new(Suit::Hearts, Value::Jack),
        Card::new(Suit::Hearts, Value::Ten),
        Card::new(Suit::Diamonds, Value::Nine),
        Card::new(Suit::Clubs, Value::Eight),
    ];
    let hand = Hand::new(cards);
    let result = hand.get_best_hand();
    // Should be identified as royal flush
    assert_eq!(
        result.hand_type(),
        crate::hand::hand_types::HandType::RoyalFlush
    );
}
