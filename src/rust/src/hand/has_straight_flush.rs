use crate::card::{Suit, Value};
use crate::hand::Hand;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

/// Helper function to check if a slice of Values contains a straight
fn has_consecutive_straight(values: &[Value]) -> bool {
    if values.len() < 5 {
        return false;
    }

    for i in 0..values.len() - 4 {
        let base_value = values[i].to_u8();
        // Check if we have 5 consecutive values starting from base_value
        if (1..5).all(|shift| values[i + shift].to_u8() == base_value + (shift as u8)) {
            return true;
        }
    }
    false
}

/// Helper function to check for Ace-low straight (A-2-3-4-5)
fn has_ace_low_straight(values: &[Value]) -> bool {
    values.contains(&Value::Ace)
        && values.contains(&Value::Two)
        && values.contains(&Value::Three)
        && values.contains(&Value::Four)
        && values.contains(&Value::Five)
}

/// Helper function to extract unique values from cards and sort them
fn get_sorted_unique_values(cards: &[crate::card::Card]) -> Vec<Value> {
    let mut unique_values = std::collections::HashSet::new();
    for card in cards {
        unique_values.insert(card.value());
    }

    let mut sorted_values: Vec<Value> = unique_values.into_iter().collect();
    sorted_values.sort();
    sorted_values
}

/// Detects if a straight flush (5 consecutive cards of the same suit) exists within the hand.
///
/// A straight flush is defined as 5 cards with consecutive values, all of the same suit.
/// This function handles both regular straight flushes (e.g., 5-6-7-8-9 of hearts) and
/// special cases like royal flushes (A-K-Q-J-10) and Ace-low straight flushes (A-2-3-4-5).
///
/// # Arguments
/// * `&self` - Reference to the Hand struct containing cards
///
/// # Returns
/// * `bool` - `true` if a straight flush is found, `false` otherwise
///
/// # Examples
///
/// ```rust
/// // Regular straight flush
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Five),
///     Card::new(Suit::Hearts, Value::Six),
///     Card::new(Suit::Hearts, Value::Seven),
///     Card::new(Suit::Hearts, Value::Eight),
///     Card::new(Suit::Hearts, Value::Nine),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_straight_flush(); // true
/// ```
///
/// ```rust
/// // Royal flush
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Ten),
///     Card::new(Suit::Hearts, Value::Jack),
///     Card::new(Suit::Hearts, Value::Queen),
///     Card::new(Suit::Hearts, Value::King),
///     Card::new(Suit::Hearts, Value::Ace),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_straight_flush(); // true
/// ```
///
/// ```rust
/// // Ace-low straight flush
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Ace),
///     Card::new(Suit::Hearts, Value::Two),
///     Card::new(Suit::Hearts, Value::Three),
///     Card::new(Suit::Hearts, Value::Four),
///     Card::new(Suit::Hearts, Value::Five),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_straight_flush(); // true
/// ```
///
/// ```rust
/// // Flush but not straight
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Two),
///     Card::new(Suit::Hearts, Value::Five),
///     Card::new(Suit::Hearts, Value::Seven),
///     Card::new(Suit::Hearts, Value::Nine),
///     Card::new(Suit::Hearts, Value::Jack),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_straight_flush(); // false
/// ```
///
/// # Performance
///
/// * Time Complexity: O(n) for suit grouping, plus O(n log n) for straight detection per suit
/// * Space Complexity: O(n) for storing suit-grouped cards
///
/// # Edge Cases
///
/// * Automatically handles royal flushes (A-K-Q-J-10) as a type of straight flush
/// * Properly handles Ace-low straight flushes (A-2-3-4-5)
/// * Only checks suits with 5+ cards for straight potential
/// * Uses efficient straight detection logic without creating temporary Hand objects
#[wasm_bindgen]
impl Hand {
    pub fn has_straight_flush(&self) -> bool {
        // Group cards by suit
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

            // Extract unique values from this suit's cards
            let sorted_values = get_sorted_unique_values(cards);

            // Check for regular straights and Ace-low straights
            if has_consecutive_straight(&sorted_values) || has_ace_low_straight(&sorted_values) {
                return true;
            }
        }

        false
    }
}
