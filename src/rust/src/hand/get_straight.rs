use crate::card::{Card, Value};
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_straight(&self) -> Vec<Card> {
        let mut values = Vec::new();
        let mut unique_values = std::collections::HashSet::new();

        for card in &self.cards() {
            if unique_values.insert(card.value()) {
                values.push(card.clone());
            }
        }

        values.sort_by(|a, b| b.value().cmp(&a.value()));

        // Check for a straight in descending order
        for i in 0..values.len() - 4 {
            let value = values[i].value();
            if value.to_u8() - 4 == values[i + 4].value().to_u8() {
                return vec![
                    values[i].clone(),
                    values[i + 1].clone(),
                    values[i + 2].clone(),
                    values[i + 3].clone(),
                    values[i + 4].clone(),
                ];
            }
        }

        // Check for a straight with Ace as 1 (low)
        if let Some(ace_index) = values.iter().position(|c| c.value() == Value::Ace) {
            for i in 0..values.len() - 3 {
                if i == ace_index {
                    continue;
                }
                let value = values[i].value();
                if value.to_u8() - 3 == values[i + 3].value().to_u8() {
                    return vec![
                        values[i].clone(),
                        values[i + 1].clone(),
                        values[i + 2].clone(),
                        values[i + 3].clone(),
                        values[ace_index].clone(),
                    ];
                }
            }
        }

        Vec::new()
    }
}
