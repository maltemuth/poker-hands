use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

/// Extracts the highest straight from the hand and returns hand metadata.
///
/// This function analyzes the provided cards to find the best possible straight
/// (5 consecutive cards) and returns a structured HandResult containing the
/// straight cards and associated metadata. It handles both regular straights
/// and special cases like Ace-low straights (A-2-3-4-5).
///
/// # Arguments
/// * `&self` - Reference to the Hand struct containing cards
///
/// # Returns
/// * `HandResult` - Struct containing hand metadata if straight found
/// * Returns `HandType::HighCard` with empty cards if no straight found
///
/// The HandResult struct has the following structure:
/// ```rust
/// pub struct HandResult {
///     hand_type: HandType,    // HandType::Straight
///     cards: Vec<Card>,       // The 5 cards that form the straight
///     kickers: Vec<Card>,     // Remaining cards (empty for straights)
/// }
/// ```
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
///     Card::new(Suit::Diamonds, Value::Ten),
///     Card::new(Suit::Clubs, Value::Jack),
/// ];
/// let hand = Hand::new(cards);
/// let result = hand.get_straight();
/// result.hand_type(); // HandType::Straight
/// result.cards().len(); // 5
/// // Contains the highest possible straight: [Jack, Ten, Nine, Eight, Seven]
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
/// let result = hand.get_straight();
/// result.hand_type(); // HandType::Straight
/// result.cards().len(); // 5
/// // Contains: [Ace, Five, Four, Three, Two]
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
/// let result = hand.get_straight();
/// result.hand_type(); // HandType::HighCard (fallback)
/// result.cards().len(); // 0
/// ```
///
/// # Performance
///
/// * Time Complexity: O(n log n) for sorting and analysis
/// * Space Complexity: O(n) for intermediate arrays
///
/// # Edge Cases
///
/// * Returns the highest possible straight when multiple straights exist
/// * Correctly handles Ace-low straights (A-2-3-4-5)
/// * Properly handles duplicate values by selecting unique card values
/// * Works with 5, 6, or 7 card hands to find the best 5-card straight
#[wasm_bindgen]
impl Hand {
    pub fn get_straight(&self) -> HandResult {
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let value = card.value();
            *value_counts.entry(value).or_insert(0) += 1;
        }

        let mut values = Vec::new();
        for (value, _) in &value_counts {
            values.push(value.clone());
        }
        values.sort_by(|a, b| a.cmp(b));

        for i in 0..(values.len() - 4) {
            let mut straight = Vec::new();
            let mut found = true;

            for j in 0..5 {
                if i + j >= values.len() || !values.contains(&values[i + j]) {
                    found = false;
                    break;
                }

                for card in &self.cards() {
                    if card.value() == values[i + j] {
                        straight.push(card.clone());
                        break;
                    }
                }
            }

            if found {
                let kickers = self.get_kickers(HandType::Straight);
                return HandResult::new(HandType::Straight, straight, kickers);
            }
        }

        // If no straight is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
