use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};

impl Hand {
    pub fn get_flush(&self) -> HandResult {
        let mut suit_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let suit = card.suit();
            *suit_counts.entry(suit).or_insert(0) += 1;
        }

        for (suit, count) in &suit_counts {
            if *count >= 5 {
                let mut flush = Vec::new();

                for card in &self.cards() {
                    if card.suit() == *suit {
                        flush.push(card.clone());
                        if flush.len() == 5 {
                            break;
                        }
                    }
                }

                let kickers = self.get_kickers(HandType::Flush);
                return HandResult::new(HandType::Flush, flush, kickers);
            }
        }

        // If no flush is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
