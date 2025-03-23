use poker_hands_rust::card::{Card, Suit, Value};
use poker_hands_rust::hand::{get_best_hand, PokerHand};

#[cfg(test)]
mod tests {
    use super::*;
    use poker_hands_rust::card::{Card, Suit, Value};
    use poker_hands_rust::hand::{get_best_hand, PokerHand};

    #[test]
    fn test_royal_flush() {
        let royal_flush = vec![
            Card {
                suit: Suit::Hearts,
                value: Value::Ace,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::King,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Queen,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Jack,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Ten,
            },
        ];
        assert_eq!(get_best_hand(&royal_flush), PokerHand::RoyalFlush);
    }

    #[test]
    fn test_straight_flush() {
        let straight_flush = vec![
            Card {
                suit: Suit::Spades,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Spades,
                value: Value::Eight,
            },
            Card {
                suit: Suit::Spades,
                value: Value::Nine,
            },
            Card {
                suit: Suit::Spades,
                value: Value::Ten,
            },
            Card {
                suit: Suit::Spades,
                value: Value::Jack,
            },
        ];
        assert_eq!(get_best_hand(&straight_flush), PokerHand::StraightFlush);
    }

    #[test]
    fn test_four_of_a_kind() {
        let four_of_a_kind = vec![
            Card {
                suit: Suit::Clubs,
                value: Value::Ace,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Ace,
            },
            Card {
                suit: Suit::Diamonds,
                value: Value::Ace,
            },
            Card {
                suit: Suit::Spades,
                value: Value::Ace,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::King,
            },
        ];
        assert_eq!(get_best_hand(&four_of_a_kind), PokerHand::FourOfAKind);
    }

    #[test]
    fn test_full_house() {
        let full_house = vec![
            Card {
                suit: Suit::Clubs,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Diamonds,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Spades,
                value: Value::King,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::King,
            },
        ];
        assert_eq!(get_best_hand(&full_house), PokerHand::FullHouse);
    }

    #[test]
    fn test_flush() {
        let flush = vec![
            Card {
                suit: Suit::Clubs,
                value: Value::Ace,
            },
            Card {
                suit: Suit::Clubs,
                value: Value::King,
            },
            Card {
                suit: Suit::Clubs,
                value: Value::Queen,
            },
            Card {
                suit: Suit::Clubs,
                value: Value::Jack,
            },
            Card {
                suit: Suit::Clubs,
                value: Value::Nine,
            },
        ];
        assert_eq!(get_best_hand(&flush), PokerHand::Flush);
    }

    #[test]
    fn test_straight() {
        let straight = vec![
            Card {
                suit: Suit::Clubs,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Eight,
            },
            Card {
                suit: Suit::Diamonds,
                value: Value::Nine,
            },
            Card {
                suit: Suit::Spades,
                value: Value::Ten,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Jack,
            },
        ];
        assert_eq!(get_best_hand(&straight), PokerHand::Straight);
    }

    #[test]
    fn test_three_of_a_kind() {
        let three_of_a_kind = vec![
            Card {
                suit: Suit::Clubs,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Diamonds,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Spades,
                value: Value::King,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Queen,
            },
        ];
        assert_eq!(get_best_hand(&three_of_a_kind), PokerHand::ThreeOfAKind);
    }

    #[test]
    fn test_two_pair() {
        let two_pair = vec![
            Card {
                suit: Suit::Clubs,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Diamonds,
                value: Value::King,
            },
            Card {
                suit: Suit::Spades,
                value: Value::King,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Queen,
            },
        ];
        assert_eq!(get_best_hand(&two_pair), PokerHand::TwoPair);
    }

    #[test]
    fn test_one_pair() {
        let one_pair = vec![
            Card {
                suit: Suit::Clubs,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Diamonds,
                value: Value::King,
            },
            Card {
                suit: Suit::Spades,
                value: Value::Queen,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Jack,
            },
        ];
        assert_eq!(get_best_hand(&one_pair), PokerHand::OnePair);
    }

    #[test]
    fn test_high_card() {
        let high_card = vec![
            Card {
                suit: Suit::Clubs,
                value: Value::Seven,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Eight,
            },
            Card {
                suit: Suit::Diamonds,
                value: Value::Nine,
            },
            Card {
                suit: Suit::Spades,
                value: Value::Ten,
            },
            Card {
                suit: Suit::Hearts,
                value: Value::Jack,
            },
        ];
        assert_eq!(get_best_hand(&high_card), PokerHand::HighCard);
    }
}
