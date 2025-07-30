use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_straight(&self) -> HandResult {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        let mut values = Vec::new();
        for (value, _) in &value_counts {
            values.push(value.clone());
        }
        values.sort_by(|a, b| a.cmp(b));

        for i in 0..(values.len() - 4) {
            let mut straight = Vec::new();
            let mut found = true;

            for j in 0..5 {
                if i + j >= values.len() || !values.contains(&values[i + j]) {
                    found = false;
                    break;
                }

                for card in &self.cards() {
                    if card.value() == values[i + j] {
                        straight.push(card.clone());
                        break;
                    }
                }
            }

            if found {
                let kickers = self.get_kickers(HandType::Straight);
                return HandResult::new(HandType::Straight, straight, kickers);
            }
        }

        // If no straight is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
