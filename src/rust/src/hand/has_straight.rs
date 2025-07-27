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
        if let Some(ace_index) = sorted_values.iter().position(|&v| v == Value::Ace) {
            for i in 0..sorted_values.len() - 4 {
                if i == ace_index {
                    continue;
                }
                let value = sorted_values[i];
                if sorted_values[(i + 1) % sorted_values.len()] == Value::from_u8(value.to_u8() + 1)
                    && sorted_values[(i + 2) % sorted_values.len()]
                        == Value::from_u8(value.to_u8() + 2)
                    && sorted_values[(i + 3) % sorted_values.len()]
                        == Value::from_u8(value.to_u8() + 3)
                    && sorted_values[(i + 4) % sorted_values.len()]
                        == Value::from_u8(value.to_u8() + 4)
                {
                    return true;
                }
            }
        }

        false
    }
}
