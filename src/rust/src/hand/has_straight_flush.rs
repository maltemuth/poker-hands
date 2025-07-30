use crate::hand::Hand;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

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
/// * Reuses existing `has_straight` logic for each suit group
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
