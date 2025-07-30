use crate::card::Card;
use crate::hand::hand_types::HandType;
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_kickers(&self, used_cards: Vec<Card>) -> Vec<Card> {
        let mut remaining_cards = self.cards();
        for card in used_cards {
            remaining_cards.retain(|c| c != &card);
        }

        let mut sorted_cards = remaining_cards;
        sorted_cards.sort_by(|a, b| b.value().cmp(&a.value()));

        sorted_cards
            .iter()
            .take(5 - used_cards.len())
            .cloned()
            .collect()
    }
}
