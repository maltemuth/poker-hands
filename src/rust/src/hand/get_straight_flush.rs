use crate::card::Card;
use crate::hand::Hand;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_straight_flush(&self) -> Vec<Card> {
        // First, group cards by suit
        let mut cards_by_suit = HashMap::new();

        for card in &self.cards() {
            let suit = card.suit();
            cards_by_suit
                .entry(suit)
                .or_insert_with(Vec::new)
                .push(card.clone());
        }

        // Check each suit group for a straight
        for (_suit, cards) in &cards_by_suit {
            if cards.len() < 5 {
                continue;
            }

            // Create a temporary hand with just these cards
            let temp_hand = Hand {
                cards: cards.clone(),
            };

            // Use the existing get_straight function
            let mut straight = temp_hand.get_straight();

            // If we found a straight, sort it in ascending order and return
            if !straight.is_empty() {
                straight.sort_by(|a, b| a.value().cmp(&b.value()));
                return straight;
            }
        }

        Vec::new()
    }
}
