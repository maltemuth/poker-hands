use crate::card::Value;
use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

/// Helper function to find all possible straights in sorted unique values
fn find_all_straights(values: &[Value]) -> Vec<Vec<Value>> {
    let mut straights = Vec::new();

    // Check for regular straights
    for i in 0..values.len().saturating_sub(4) {
        let mut is_straight = true;

        // Check if 5 consecutive values form a straight
        for j in 0..4 {
            if i + j + 1 >= values.len() {
                is_straight = false;
                break;
            }
            // Check if consecutive values differ by 1
            if values[i + j + 1] as u8 != values[i + j] as u8 + 1 {
                is_straight = false;
                break;
            }
        }

        if is_straight {
            let straight_values: Vec<Value> = values[i..i + 5].to_vec();
            straights.push(straight_values);
        }
    }

    // Check for Ace-low straight (A-2-3-4-5)
    if values.contains(&Value::Ace)
        && values.contains(&Value::Two)
        && values.contains(&Value::Three)
        && values.contains(&Value::Four)
        && values.contains(&Value::Five)
    {
        straights.push(vec![
            Value::Five,
            Value::Four,
            Value::Three,
            Value::Two,
            Value::Ace,
        ]);
    }

    straights
}

/// Helper function to get actual cards for a straight (highest to lowest)
fn get_cards_for_straight(
    cards: &[crate::card::Card],
    straight_values: &[Value],
) -> Vec<crate::card::Card> {
    let mut result = Vec::new();

    // Check if this is an Ace-low straight [Five, Four, Three, Two, Ace]
    let is_ace_low = straight_values.len() == 5
        && straight_values[0] == Value::Five
        && straight_values[4] == Value::Ace;

    // Find cards with the values in the straight, preferring higher cards when duplicates exist
    for &value in straight_values {
        let matching_cards: Vec<_> = cards.iter().filter(|card| card.value() == value).collect();

        // Take the first matching card (in case of duplicates, any will do for straight detection)
        if let Some(card) = matching_cards.first() {
            result.push((*card).clone());
        }
    }

    // Sort the result from highest to lowest value, but only for non-Ace-low straights
    if !is_ace_low {
        result.sort_by(|a, b| b.value().cmp(&a.value()));
    }
    result
}

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
/// // Contains: [Five, Four, Three, Two, Ace]
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
        let all_cards = self.cards();

        // Extract unique values and sort them
        let mut unique_values = HashMap::new();
        for card in &all_cards {
            unique_values.insert(card.value(), ());
        }

        let mut sorted_values: Vec<Value> = unique_values.keys().cloned().collect();
        sorted_values.sort();

        // Find all possible straights
        let all_straights = find_all_straights(&sorted_values);

        // If no straights found, return empty result
        if all_straights.is_empty() {
            return HandResult::new(HandType::HighCard, Vec::new(), Vec::new());
        }

        // Find the highest straight by comparing the highest card in each straight
        let best_straight_values = all_straights
            .iter()
            .max_by_key(|straight| {
                // For Ace-low straight, the highest card is Five
                // For regular straights, the highest card is the last element
                if straight.len() == 5 && straight[0] == Value::Five && straight[4] == Value::Ace {
                    // This is an Ace-low straight, highest card is Five
                    Value::Five
                } else {
                    // This is a regular straight, highest card is the last element
                    *straight.last().unwrap()
                }
            })
            .unwrap();

        let straight_cards = get_cards_for_straight(&all_cards, best_straight_values);
        HandResult::new(HandType::Straight, straight_cards, Vec::new())
    }
}
