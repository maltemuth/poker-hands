use crate::card::Card;
use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_royal_flush(&self) -> HandResult {
        let mut suit_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let suit = card.suit();
            *suit_counts.entry(suit).or_insert(0) += 1;
        }

        for (suit, count) in &suit_counts {
            if *count >= 5 {
                let mut royal_flush = Vec::new();
                let royal_values = vec![10, 11, 12, 13, 14]; // Jack, Queen, King, Ace

                for value in royal_values {
                    for card in &self.cards() {
                        if card.suit() == *suit && card.value().to_u8() == value {
                            royal_flush.push(card.clone());
                            break;
                        }
                    }
                }

                if royal_flush.len() == 5 {
                    let kickers = self.get_kickers(royal_flush.clone());
                    return HandResult::new(HandType::RoyalFlush, royal_flush, kickers);
                }
            }
        }

        // If no royal flush is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
