use crate::card::Value;
use crate::hand::Hand;
use std::collections::HashSet;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn has_straight(&self) -> bool {
        let mut values = HashSet::new();

        for card in &self.cards() {
            values.insert(card.value());
        }

        let mut sorted_values: Vec<Value> = values.into_iter().collect();
        sorted_values.sort();

        // Check for a straight in the normal order
        for i in 0..sorted_values.len() - 4 {
            let value = sorted_values[i];
            if sorted_values[i + 1] == Value::from_u8(value.to_u8() + 1)
                && sorted_values[i + 2] == Value::from_u8(value.to_u8() + 2)
                && sorted_values[i + 3] == Value::from_u8(value.to_u8() + 3)
                && sorted_values[i + 4] == Value::from_u8(value.to_u8() + 4)
            {
                return true;
            }
        }

        // Check for a straight with Ace as 1
        if sorted_values.len() >= 5 {
            if sorted_values.contains(&Value::Two)
                && sorted_values.contains(&Value::Three)
                && sorted_values.contains(&Value::Four)
                && sorted_values.contains(&Value::Five)
                && sorted_values.contains(&Value::Ace)
            {
                return true;
            }
        }

        false
    }
}
