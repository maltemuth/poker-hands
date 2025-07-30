use crate::card::{Suit, Value};
use crate::hand::Hand;
use wasm_bindgen::prelude::*;

/// Detects if a royal flush (A-K-Q-J-10 of the same suit) exists within the hand.
///
/// A royal flush is defined as the ten, jack, queen, king, and ace of the same suit.
/// This function checks if all five cards of any suit are present in the hand.
///
/// # Arguments
/// * `&self` - Reference to the Hand struct containing cards
///
/// # Returns
/// * `bool` - `true` if a royal flush is found, `false` otherwise
///
/// # Examples
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
/// hand.has_royal_flush(); // true
/// ```
///
/// ```rust
/// // Not a royal flush (missing Ace)
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Ten),
///     Card::new(Suit::Hearts, Value::Jack),
///     Card::new(Suit::Hearts, Value::Queen),
///     Card::new(Suit::Hearts, Value::King),
///     Card::new(Suit::Hearts, Value::Nine),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_royal_flush(); // false
/// ```
///
/// ```rust
/// // Not a royal flush (different suits)
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Ten),
///     Card::new(Suit::Diamonds, Value::Jack),
///     Card::new(Suit::Clubs, Value::Queen),
///     Card::new(Suit::Spades, Value::King),
///     Card::new(Suit::Hearts, Value::Ace),
/// ];
/// let hand = Hand::new(cards);
/// hand.has_royal_flush(); // false
/// ```
///
/// # Performance
///
/// * Time Complexity: O(n) for suit grouping and value checking
/// * Space Complexity: O(n) for storing suit-grouped cards
///
/// # Edge Cases
///
/// * Handles hands with fewer than 5 cards (returns false)
/// * Handles duplicate cards correctly
/// * Only checks for exact royal flush combinations
#[wasm_bindgen]
impl Hand {
    pub fn has_royal_flush(&self) -> bool {
        // Need at least 5 cards for a royal flush
        if self.cards().len() < 5 {
            return false;
        }

        // Define the values needed for a royal flush
        let royal_values = [
            Value::Ten,
            Value::Jack,
            Value::Queen,
            Value::King,
            Value::Ace,
        ];

        // Check each suit for a royal flush
        for suit in &[Suit::Hearts, Suit::Diamonds, Suit::Clubs, Suit::Spades] {
            let mut found_all_values = true;

            // Check if all royal values are present for this suit
            for &value in &royal_values {
                let has_card = self
                    .cards()
                    .iter()
                    .any(|card| card.suit() == *suit && card.value() == value);

                if !has_card {
                    found_all_values = false;
                    break;
                }
            }

            // If we found all values for this suit, we have a royal flush
            if found_all_values {
                return true;
            }
        }

        false
    }
}
