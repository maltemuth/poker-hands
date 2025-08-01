use crate::card::{Suit, Value};
use crate::hand::hand_types::HandType;
use crate::hand::{Hand, HandResult};
use std::collections::HashMap;

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

/// Helper function to get actual cards for a straight flush (highest to lowest)
fn get_cards_for_straight_flush(
    cards: &[crate::card::Card],
    suit: Suit,
    straight_values: &[Value],
) -> Vec<crate::card::Card> {
    let mut result = Vec::new();

    // Check if this is an Ace-low straight [Five, Four, Three, Two, Ace]
    let is_ace_low = straight_values.len() == 5
        && straight_values[0] == Value::Five
        && straight_values[4] == Value::Ace;

    // Find cards with the specified suit and values in the straight
    for &value in straight_values {
        let matching_cards: Vec<_> = cards
            .iter()
            .filter(|card| card.suit() == suit && card.value() == value)
            .collect();

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

/// Helper function to extract unique values from cards of a specific suit and sort them
fn get_sorted_unique_values_by_suit(cards: &[crate::card::Card], suit: Suit) -> Vec<Value> {
    let mut unique_values = std::collections::HashSet::new();
    for card in cards {
        if card.suit() == suit {
            unique_values.insert(card.value());
        }
    }

    let mut sorted_values: Vec<Value> = unique_values.into_iter().collect();
    sorted_values.sort();
    sorted_values
}

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
///     // Add some other cards
///     Card::new(Suit::Diamonds, Value::Seven),
///     Card::new(Suit::Clubs, Value::Eight),
/// ];
/// let hand = Hand::new(cards);
/// let result = hand.get_straight_flush();
/// result.hand_type(); // HandType::StraightFlush
/// result.cards().len(); // 5
/// // Contains the highest possible straight flush: [Nine, Eight, Seven, Six, Five]
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
/// // Contains: [Five, Four, Three, Two, Ace]
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
impl Hand {
    pub fn get_straight_flush(&self) -> HandResult {
        let all_cards = self.cards();

        // Group cards by suit
        let mut cards_by_suit = HashMap::new();
        for card in &all_cards {
            let suit = card.suit();
            cards_by_suit
                .entry(suit)
                .or_insert_with(Vec::new)
                .push(card.clone());
        }

        let mut all_straight_flushes = Vec::new();

        // Check each suit group for straight flushes
        for (suit, cards) in cards_by_suit {
            if cards.len() < 5 {
                continue;
            }

            // Extract unique values from this suit's cards
            let sorted_values = get_sorted_unique_values_by_suit(&all_cards, suit);

            // Find all possible straights in this suit
            let straights = find_all_straights(&sorted_values);

            // For each straight found, get the actual cards
            for straight_values in straights {
                let straight_flush_cards =
                    get_cards_for_straight_flush(&all_cards, suit, &straight_values);
                if straight_flush_cards.len() == 5 {
                    all_straight_flushes.push((straight_flush_cards, suit));
                }
            }
        }

        // If no straight flushes found, return empty result
        if all_straight_flushes.is_empty() {
            return HandResult::new(HandType::HighCard, Vec::new(), Vec::new());
        }

        // For straight flushes, we need to find the one with the highest card
        // But we need to be careful with Ace-low straight flushes
        let best_straight_flush = all_straight_flushes
            .iter()
            .max_by_key(|(cards, _)| {
                // Check if this is an Ace-low straight flush (A-2-3-4-5)
                // In our representation, this would be [Five, Four, Three, Two, Ace]
                if cards.len() == 5
                    && cards[0].value() == Value::Five
                    && cards[4].value() == Value::Ace
                {
                    // This is an Ace-low straight flush, highest card is Five
                    Value::Five
                } else {
                    // This is a regular straight flush, highest card is the first card
                    cards.first().unwrap().value()
                }
            })
            .unwrap()
            .0
            .clone();

        HandResult::new(HandType::StraightFlush, best_straight_flush, Vec::new())
    }
}
