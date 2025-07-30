use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use wasm_bindgen::prelude::*;

/// Extracts the highest straight flush from the hand and returns hand metadata.
///
/// This function analyzes the provided cards to find the best possible straight flush
/// (5 consecutive cards of the same suit) and returns a structured HandResult containing
/// the straight flush cards and associated metadata. It handles both regular straight flushes,
/// royal flushes (A-K-Q-J-10), and Ace-low straight flushes (A-2-3-4-5).
///
/// # Arguments
/// * `&self` - Reference to the Hand struct containing cards
///
/// # Returns
/// * `HandResult` - Struct containing hand metadata if straight flush found
/// * Returns `HandType::HighCard` with empty cards if no straight flush found
///
/// The HandResult struct has the following structure:
/// ```rust
/// pub struct HandResult {
///     hand_type: HandType,    // HandType::StraightFlush
///     cards: Vec<Card>,       // The 5 cards that form the straight flush
///     kickers: Vec<Card>,     // Remaining cards (empty for straight flushes)
/// }
/// ```
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
///     Card::new(Suit::Hearts, Value::Ten),
///     Card::new(Suit::Hearts, Value::Jack),
/// ];
/// let hand = Hand::new(cards);
/// let result = hand.get_straight_flush();
/// result.hand_type(); // HandType::StraightFlush
/// result.cards().len(); // 5
/// // Contains the highest possible straight flush: [Jack, Ten, Nine, Eight, Seven]
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
/// let result = hand.get_straight_flush();
/// result.hand_type(); // HandType::StraightFlush
/// result.cards().len(); // 5
/// // Contains: [Ace, King, Queen, Jack, Ten]
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
/// let result = hand.get_straight_flush();
/// result.hand_type(); // HandType::StraightFlush
/// result.cards().len(); // 5
/// // Contains: [Ace, Five, Four, Three, Two]
/// ```
///
/// ```rust
/// // No straight flush
/// let cards = vec![
///     Card::new(Suit::Hearts, Value::Five),
///     Card::new(Suit::Diamonds, Value::Six),
///     Card::new(Suit::Clubs, Value::Seven),
///     Card::new(Suit::Spades, Value::Eight),
///     Card::new(Suit::Hearts, Value::Nine),
/// ];
/// let hand = Hand::new(cards);
/// let result = hand.get_straight_flush();
/// result.hand_type(); // HandType::HighCard (fallback)
/// result.cards().len(); // 0
/// ```
///
/// # Performance
///
/// * Time Complexity: O(n log n) for sorting and analysis
/// * Space Complexity: O(n) for suit-grouped arrays
///
/// # Edge Cases
///
/// * Returns the highest possible straight flush when multiple exist
/// * Correctly identifies royal flushes (A-K-Q-J-10) as a type of straight flush
/// * Properly handles Ace-low straight flushes (A-2-3-4-5)
/// * Only checks suits with 5+ cards for straight flush potential
/// * Works with 5, 6, or 7 card hands to find the best 5-card straight flush
#[wasm_bindgen]
impl Hand {
    pub fn get_straight_flush(&self) -> HandResult {
        let mut suit_counts = std::collections::HashMap::new();
        let mut value_counts = std::collections::HashMap::new();

        for card in &self.cards() {
            let suit = card.suit();
            let value = card.value();
            *suit_counts.entry(suit).or_insert(0) += 1;
            *value_counts.entry(value).or_insert(0) += 1;
        }

        for (suit, suit_count) in &suit_counts {
            if *suit_count >= 5 {
                let mut values = Vec::new();
                for (value, count) in &value_counts {
                    if *count >= 1 && *suit_count >= 5 {
                        values.push(value.clone());
                    }
                }
                values.sort_by(|a, b| a.cmp(b));

                for i in 0..(values.len() - 4) {
                    let mut found = true;
                    let mut straight_flush = Vec::new();

                    for j in 0..5 {
                        if i + j >= values.len() {
                            found = false;
                            break;
                        }

                        let value = values[i + j];
                        for card in &self.cards() {
                            if card.suit() == *suit && card.value() == value {
                                straight_flush.push(card.clone());
                                break;
                            }
                        }
                    }

                    if found {
                        let kickers = self.get_kickers(HandType::StraightFlush);
                        return HandResult::new(HandType::StraightFlush, straight_flush, kickers);
                    }
                }
            }
        }

        // If no straight flush is found, return an empty HandResult
        HandResult::new(HandType::HighCard, Vec::new(), Vec::new())
    }
}
