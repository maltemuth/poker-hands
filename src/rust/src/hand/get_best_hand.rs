use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Hand {
    pub fn get_best_hand(&self) -> HandResult {
        let mut cards = self.cards.clone();
        cards.sort_by(|a, b| b.value().cmp(&a.value()));

        // Cache value counts to avoid repeated calculations
        let mut value_counts = HashMap::new();
        for card in &self.cards {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        // Sort value counts by frequency (descending) and then by value (descending)
        let mut sorted_value_counts: Vec<_> = value_counts.iter().collect();
        sorted_value_counts.sort_by(|a, b| b.1.cmp(a.1).then_with(|| b.0.cmp(a.0)));

        // Check for straight flush
        if self.has_straight_flush() {
            // Check specifically for royal flush
            if self.has_royal_flush() {
                // Get the straight flush and change its type to RoyalFlush
                let royal_flush = self.get_royal_flush();
                return royal_flush;
            }
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
            // If no pairs exist in value counts, we can skip checking for full house, four of a kind, etc.
            if !self.has_pair_with_counts(&value_counts) {
                return self.get_flush();
            }

            // Check for four of a kind
            if self.has_four_of_a_kind_with_counts(&value_counts) {
                return self.get_four_of_a_kind();
            }

            // Check for full house
            if self.has_full_house_with_counts(&value_counts) {
                return self.get_full_house();
            }

            // No full house and no four-of-a-kind means flush is highest again
            return self.get_flush();
        }

        // Check for straight
        if self.has_straight() {
            // If no pairs exist in value counts, we can skip checking for full house, four of a kind, etc.
            if !self.has_pair_with_counts(&value_counts) {
                return self.get_straight();
            }

            // Check for four of a kind
            if self.has_four_of_a_kind_with_counts(&value_counts) {
                return self.get_four_of_a_kind();
            }

            // Check for full house
            if self.has_full_house_with_counts(&value_counts) {
                return self.get_full_house();
            }

            // If no full house and no four-of-a-kind, straight is highest again
            return self.get_straight();
        }

        // From here on: no flush, no straight; only card combos remain

        // If no pairs exist, return high card
        if !self.has_pair_with_counts(&value_counts) {
            return HandResult::new(HandType::HighCard, Vec::from(&cards[0..5]), Vec::new());
        }

        // If no three of a kind, check for two pair or regular pair
        if !self.has_three_of_a_kind_with_counts(&value_counts) {
            // A pair, but no three-of-a-kind means two pair is still possible
            if self.has_two_pair_with_counts(&value_counts) {
                return self.get_two_pair();
            }

            return self.get_pair();
        }

        // Now, the usual is possible
        if self.has_four_of_a_kind_with_counts(&value_counts) {
            return self.get_four_of_a_kind();
        }

        if self.has_full_house_with_counts(&value_counts) {
            return self.get_full_house();
        }

        return self.get_three_of_a_kind();
    }

    // Helper methods that use cached value counts
    fn has_pair_with_counts(&self, value_counts: &HashMap<crate::card::Value, usize>) -> bool {
        for count in value_counts.values() {
            if *count >= 2 {
                return true;
            }
        }
        false
    }

    fn has_two_pair_with_counts(&self, value_counts: &HashMap<crate::card::Value, usize>) -> bool {
        let mut pair_count = 0;
        for count in value_counts.values() {
            if *count >= 2 {
                pair_count += 1;
                if pair_count >= 2 {
                    return true;
                }
            }
        }
        false
    }

    fn has_three_of_a_kind_with_counts(
        &self,
        value_counts: &HashMap<crate::card::Value, usize>,
    ) -> bool {
        for count in value_counts.values() {
            if *count >= 3 {
                return true;
            }
        }
        false
    }

    fn has_four_of_a_kind_with_counts(
        &self,
        value_counts: &HashMap<crate::card::Value, usize>,
    ) -> bool {
        for count in value_counts.values() {
            if *count >= 4 {
                return true;
            }
        }
        false
    }

    fn has_full_house_with_counts(
        &self,
        value_counts: &HashMap<crate::card::Value, usize>,
    ) -> bool {
        if value_counts.len() < 2 {
            return false;
        }

        let mut sorted_values: Vec<_> = value_counts.iter().collect();
        sorted_values.sort_by(|a, b| b.1.cmp(a.1));

        // Check for 3 of a kind and 2 of a kind
        if *sorted_values[0].1 >= 3 && *sorted_values[1].1 >= 2 {
            return true;
        }

        false
    }
}
