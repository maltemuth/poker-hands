use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_three_of_a_kind(&self) -> Vec<Card> {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        for (value, count) in &value_counts {
            if *count >= 3 {
                let mut three_of_a_kind = Vec::new();

                for card in &self.cards() {
                    if card.value() == *value {
                        three_of_a_kind.push(card.clone());
                        if three_of_a_kind.len() == 3 {
                            break;
                        }
                    }
                }

                return three_of_a_kind;
            }
        }

        Vec::new()
    }
}
