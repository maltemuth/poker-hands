use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_straight_flush(&self) -> HandResult {
        let mut suit_counts = std::collections::HashMap::new();
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let suit = card.suit();
            let value = card.value();
            *suit_counts.entry(suit).or_insert(0) += 1;
            *value_counts.entry(value).or_insert(0) += 1;
        }

        for (suit, suit_count) in &suit_counts {
            if *suit_count >= 5 {
                let mut values = Vec::new();
                for (value, count) in &value_counts {
                    if *count >= 1 && *suit_count >= 5 {
                        values.push(value.clone());
                    }
                }
                values.sort_by(|a, b| a.cmp(b));

                for i in 0..(values.len() - 4) {
                    let mut found = true;
                    let mut straight_flush = Vec::new();

                    for j in 0..5 {
                        if i + j >= values.len() {
                            found = false;
                            break;
                        }

                        let value = values[i + j];
                        for card in &self.cards() {
                            if card.suit() == *suit && card.value() == value {
                                straight_flush.push(card.clone());
                                break;
                            }
                        }
                    }

                    if found {
                        let kickers = self.get_kickers(HandType::StraightFlush);
                        return HandResult::new(HandType::StraightFlush, straight_flush, kickers);
                    }
                }
            }
        }

        // If no straight flush is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
