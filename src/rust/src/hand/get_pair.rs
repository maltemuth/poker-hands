use crate::card::Card;
use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_pair(&self) -> HandResult {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        for (value, count) in &value_counts {
            if *count >= 2 {
                let mut pair = Vec::new();

                for card in &self.cards() {
                    if card.value() == *value {
                        pair.push(card.clone());
                        if pair.len() == 2 {
                            break;
                        }
                    }
                }

                let kickers = self.get_kickers(pair.clone());
                return HandResult::new(HandType::Pair, pair, kickers);
            }
        }

        // If no pair is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
