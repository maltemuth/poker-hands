use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn has_flush(&self) -> bool {
        let mut counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let suit = card.suit();
            *counts.entry(suit).or_insert(0) += 1;
            if *counts.get(&suit).unwrap() >= 5 {
                return true;
            }
        }
        false
    }
}
