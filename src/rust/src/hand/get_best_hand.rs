use crate::card::Card;
use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_best_hand(&self) -> HandResult {
        let mut cards = self.cards.clone();
        cards.sort_by(|a, b| b.value().cmp(&a.value()));

        // Check for straight flush
        if self.has_straight_flush() {
            return self.get_straight_flush();
        }

        // Check for four of a kind
        if self.has_four_of_a_kind() {
            return self.get_four_of_a_kind();
        }

        // Check for full house
        if self.has_full_house() {
            return self.get_full_house();
        }

        // Check for flush
        if self.has_flush() {
            return self.get_flush();
        }

        // Check for straight
        if self.has_straight() {
            return self.get_straight();
        }

        // Check for three of a kind
        if self.has_three_of_a_kind() {
            return self.get_three_of_a_kind();
        }

        // Check for two pair
        if self.has_two_pair() {
            return self.get_two_pair();
        }

        // Check for pair
        if self.has_pair() {
            return self.get_pair();
        }

        // High card
        HandResult::new(HandType::HighCard, Vec::from(&cards[0..5]), Vec::new())
    }
}
