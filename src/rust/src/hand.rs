use crate::card::Card;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Hand {
    cards: Vec<Card>,
}

#[wasm_bindgen]
impl Hand {
    pub fn new(cards: Vec<Card>) -> Hand {
        Hand { cards }
    }

    pub fn cards(&self) -> Vec<Card> {
        self.cards.clone()
    }

    pub fn has_flush(&self) -> bool {
        let mut counts = HashMap::new();

        for card in &self.cards {
            let suit = card.suit();
            *counts.entry(suit).or_insert(0) += 1;
            if *counts.get(&suit).unwrap() >= 5 {
                return true;
            }
        }
        false
    }

    pub fn get_flush(&self) -> Vec<Card> {
        let mut cards_by_suit = std::collections::HashMap::new();

        for card in &self.cards {
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
