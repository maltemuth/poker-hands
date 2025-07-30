use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_two_pair(&self) -> HandResult {
        let mut value_counts = std::collections::HashMap::new();
        let mut pairs = Vec::new();

        // Count occurrences of each card value
        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        // Find all pairs
        for (value, &count) in &value_counts {
            if count >= 2 {
                let mut pair = Vec::new();

                for card in &self.cards() {
                    if card.value() == *value {
                        pair.push(card.clone());
                        if pair.len() == 2 {
                            break;
                        }
                    }
                }

                pairs.extend(pair);
                if pairs.len() >= 4 {
                    break;
                }
            }
        }

        // Return the first 4 cards if we have at least 2 pairs
        if pairs.len() >= 4 {
            let kickers = self.get_kickers(HandType::TwoPair);
            HandResult::new(HandType::TwoPair, pairs, kickers)
        } else {
            // If no two pair is found, return an empty HandResult
            HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
        }
    }
}
