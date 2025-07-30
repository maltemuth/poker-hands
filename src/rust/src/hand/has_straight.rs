use crate::card::Value;
use crate::hand::Hand;
use std::collections::HashSet;
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

/// Detects if a straight (5 consecutive cards) exists within the hand.
///
/// A straight is defined as 5 cards with consecutive values. This function handles
/// both regular straights (e.g., 5-6-7-8-9) and Ace-low straights (A-2-3-4-5)
/// by treating Ace as value 1 in the latter case.
///
/// # Arguments
/// * `&self` - Reference to the Hand struct containing cards
///
/// # Returns
/// * `bool` - `true` if a straight is found, `false` otherwise
///
/// # Examples
///
/// ```rust
/// // Regular straight
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Five),
///     Card::new(Suit::Diamonds, Value::Six),
///     Card::new(Suit::Clubs, Value::Seven),
///     Card::new(Suit::Spades, Value::Eight),
///     Card::new(Suit::Hearts, Value::Nine),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_straight(); // true
/// ```
///
/// ```rust
/// // Ace-low straight
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Ace),
///     Card::new(Suit::Diamonds, Value::Two),
///     Card::new(Suit::Clubs, Value::Three),
///     Card::new(Suit::Spades, Value::Four),
///     Card::new(Suit::Hearts, Value::Five),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_straight(); // true
/// ```
///
/// ```rust
/// // No straight
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Two),
///     Card::new(Suit::Diamonds, Value::Four),
///     Card::new(Suit::Clubs, Value::Six),
///     Card::new(Suit::Spades, Value::Eight),
///     Card::new(Suit::Hearts, Value::Ten),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_straight(); // false
/// ```
///
/// # Performance
///
/// * Time Complexity: O(n log n) for sorting unique values
/// * Space Complexity: O(n) for storing unique values in HashSet
///
/// # Edge Cases
///
/// * Automatically filters duplicate card values using HashSet
/// * Handles Ace as both high (14) and low (1) value
/// * Returns `false` if fewer than 5 unique values exist
#[wasm_bindgen]
impl Hand {
    pub fn has_straight(&self) -> bool {
        // Extract unique values from cards
        let mut unique_values = HashSet::new();
        for card in &self.cards() {
            unique_values.insert(card.value());
        }

        // Convert to sorted vector
        let mut sorted_values: Vec<Value> = unique_values.into_iter().collect();
        sorted_values.sort();

        // Check for regular straights
        if has_consecutive_straight(&sorted_values) {
            return true;
        }

        // Check for Ace-low straight (A-2-3-4-5)
        if has_ace_low_straight(&sorted_values) {
            return true;
        }

        false
    }
}
