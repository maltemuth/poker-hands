use crate::card::Card;
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_flush(&self) -> Vec<Card> {
        let mut cards_by_suit = std::collections::HashMap::new();

        for card in &self.cards() {
            let suit = card.suit();
            cards_by_suit
                .entry(suit)
                .or_insert_with(Vec::new)
                .push(card.clone());
        }

        if let Some(candidate) = cards_by_suit.values().find(|cards| cards.len() >= 5) {
            let mut flush = candidate.clone();
            flush.sort_by(|a, b| b.value().cmp(&a.value()));
            flush.truncate(5);
            return flush;
        }

        Vec::new()
    }
}
