use crate::card::Card;
use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_full_house(&self) -> HandResult {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        let mut three_of_a_kind = Vec::new();
        let mut pair = Vec::new();

        for (value, count) in &value_counts {
            if *count >= 3 {
                for card in &self.cards() {
                    if card.value() == *value {
                        three_of_a_kind.push(card.clone());
                        if three_of_a_kind.len() == 3 {
                            break;
                        }
                    }
                }
            } else if *count >= 2 && pair.is_empty() {
                for card in &self.cards() {
                    if card.value() == *value {
                        pair.push(card.clone());
                        if pair.len() == 2 {
                            break;
                        }
                    }
                }
            }
        }

        if !three_of_a_kind.is_empty() && !pair.is_empty() {
            let mut full_house = Vec::new();
            full_house.extend(three_of_a_kind);
            full_house.extend(pair);

            let kickers = self.get_kickers(full_house.clone());
            return HandResult::new(HandType::FullHouse, full_house, kickers);
        }

        // If no full house is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
