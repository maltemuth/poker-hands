use crate::card::Value;
use crate::hand::Hand;
use std::collections::HashSet;
use wasm_bindgen::prelude::*;

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
        let mut values = HashSet::new();

        for card in &self.cards() {
            values.insert(card.value());
        }

        let mut sorted_values: Vec<Value> = values.into_iter().collect();
        sorted_values.sort();

        // Check for a straight in the normal order
        for i in 0..sorted_values.len() - 4 {
            let value = sorted_values[i];
            if sorted_values[i + 1] == Value::from_u8(value.to_u8() + 1)
                && sorted_values[i + 2] == Value::from_u8(value.to_u8() + 2)
                && sorted_values[i + 3] == Value::from_u8(value.to_u8() + 3)
                && sorted_values[i + 4] == Value::from_u8(value.to_u8() + 4)
            {
                return true;
            }
        }

        // Check for a straight with Ace as 1
        if sorted_values.len() >= 5 {
            if sorted_values.contains(&Value::Two)
                && sorted_values.contains(&Value::Three)
                && sorted_values.contains(&Value::Four)
                && sorted_values.contains(&Value::Five)
                && sorted_values.contains(&Value::Ace)
            {
                return true;
            }
        }

        false
    }
}
