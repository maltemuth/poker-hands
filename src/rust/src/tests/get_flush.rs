use crate::card::Card;
use crate::hand::Hand;

#[test]
fn test_get_flush() {
    // Create a hand with a flush
    let cards = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ace),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::King),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Queen),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Nine),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Eight),
    ];

    let hand = Hand::new(cards);
    let flush = hand.get_flush();

    assert_eq!(flush.len(), 5);
    assert_eq!(flush[0].value(), crate::card::Value::Ace);
    assert_eq!(flush[1].value(), crate::card::Value::King);
    assert_eq!(flush[2].value(), crate::card::Value::Queen);
    assert_eq!(flush[3].value(), crate::card::Value::Jack);
    assert_eq!(flush[4].value(), crate::card::Value::Ten);

    // Create a hand without a flush
    let cards = vec![
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ace),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::King),
        Card::new(crate::card::Suit::Clubs, crate::card::Value::Queen),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Jack),
        Card::new(crate::card::Suit::Hearts, crate::card::Value::Ten),
        Card::new(crate::card::Suit::Spades, crate::card::Value::Nine),
        Card::new(crate::card::Suit::Diamonds, crate::card::Value::Eight),
    ];

    let hand = Hand::new(cards);
    let flush = hand.get_flush();

    assert!(flush.is_empty());
}
