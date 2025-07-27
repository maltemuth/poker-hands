use crate::hand::Hand;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn has_straight_flush(&self) -> bool {
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
        for cards in cards_by_suit.values() {
            if cards.len() < 5 {
                continue;
            }

            // Create a temporary hand with just these cards
            let temp_hand = Hand {
                cards: cards.clone(),
            };

            // Use the existing has_straight function
            if temp_hand.has_straight() {
                return true;
            }
        }

        false
    }
}
