use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_full_house(&self) -> Vec<Card> {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        let mut sorted_values: Vec<_> = value_counts.iter().collect();
        sorted_values.sort_by(|a, b| b.1.cmp(a.1));

        if sorted_values.len() < 2 {
            return Vec::new();
        }

        // Check for 3 of a kind and 2 of a kind
        if *sorted_values[0].1 >= 3 && *sorted_values[1].1 >= 2 {
            let three_of_a_kind_value = sorted_values[0].0;
            let pair_value = sorted_values[1].0;

            let mut full_house = Vec::new();

            for card in &self.cards() {
                if (card.value() == *three_of_a_kind_value && full_house.len() < 3)
                    || (card.value() == *pair_value
                        && full_house.len() >= 3
                        && full_house.len() < 5)
                {
                    full_house.push(card.clone());
                }
            }

            return full_house;
        }

        Vec::new()
    }
}
