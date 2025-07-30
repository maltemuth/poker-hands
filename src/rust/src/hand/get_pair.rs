use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_pair(&self) -> Vec<Card> {
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

                return pair;
            }
        }

        Vec::new()
    }
}
