use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_four_of_a_kind(&self) -> Vec<Card> {
        let mut value_counts = std::collections::HashMap::new();
        let mut cards_by_value = std::collections::HashMap::new();

        // First, count occurrences of each value and collect cards by value
        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
            cards_by_value
                .entry(value)
                .or_insert_with(Vec::new)
                .push(card.clone());
        }

        // Find the value with exactly 4 cards
        if let Some((value, _)) = value_counts.iter().find(|(_, &count)| count >= 4) {
            if let Some(cards) = cards_by_value.get(&value) {
                let mut four_of_a_kind = cards.clone();
                four_of_a_kind.sort_by(|a, b| b.value().cmp(&a.value()));
                four_of_a_kind.truncate(4);
                return four_of_a_kind;
            }
        }

        Vec::new()
    }
}
