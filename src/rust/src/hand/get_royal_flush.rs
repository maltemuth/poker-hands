use crate::card::{Suit, Value};
use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};

impl Hand {
    pub fn get_royal_flush(&self) -> HandResult {
        // Check each suit for a royal flush
        for suit in &[Suit::Hearts, Suit::Diamonds, Suit::Clubs, Suit::Spades] {
            let mut royal_flush = Vec::new();

            // Check for all royal flush cards
            for &value in &[
                Value::Ten,
                Value::Jack,
                Value::Queen,
                Value::King,
                Value::Ace,
            ] {
                let mut card_found = None;
                for card in self.cards().iter() {
                    if card.suit() == *suit && card.value() == value {
                        card_found = Some(card.clone());
                        break;
                    }
                }

                if let Some(card) = card_found {
                    royal_flush.push(card);
                } else {
                    // If any card is missing, this suit doesn't have a royal flush
                    royal_flush.clear();
                    break;
                }
            }

            // If we found all 5 cards, we have a royal flush
            if royal_flush.len() == 5 {
                // Sort the cards from highest to lowest value for a royal flush
                royal_flush.sort_by(|a, b| b.value().cmp(&a.value()));

                // Royal flushes don't have kickers
                return HandResult::new(HandType::RoyalFlush, royal_flush, vec![]);
            }
        }

        // If no royal flush is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
