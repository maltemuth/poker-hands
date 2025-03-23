use crate::card::{Card, Suit, Value};
use crate::utils::sort_value_counts;
use std::collections::HashMap;

#[derive(Debug, PartialEq, Eq)]
pub enum PokerHand {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    Straight,
    Flush,
    FullHouse,
    FourOfAKind,
    StraightFlush,
    RoyalFlush,
}

impl PokerHand {
    pub fn ranking(&self) -> u8 {
        match self {
            PokerHand::HighCard => 1,
            PokerHand::OnePair => 2,
            PokerHand::TwoPair => 3,
            PokerHand::ThreeOfAKind => 4,
            PokerHand::Straight => 5,
            PokerHand::Flush => 6,
            PokerHand::FullHouse => 7,
            PokerHand::FourOfAKind => 8,
            PokerHand::StraightFlush => 9,
            PokerHand::RoyalFlush => 10,
        }
    }
}

pub fn get_best_hand(cards: &[Card]) -> PokerHand {
    if has_royal_flush(cards) {
        return PokerHand::RoyalFlush;
    }

    if has_straight_flush(cards) {
        return PokerHand::StraightFlush;
    }

    if has_four_of_a_kind(cards) {
        return PokerHand::FourOfAKind;
    }

    if has_full_house(cards) {
        return PokerHand::FullHouse;
    }

    if has_flush(cards) {
        return PokerHand::Flush;
    }

    if has_straight(cards) {
        return PokerHand::Straight;
    }

    if has_three_of_a_kind(cards) {
        return PokerHand::ThreeOfAKind;
    }

    if has_two_pair(cards) {
        return PokerHand::TwoPair;
    }

    if has_pair(cards) {
        return PokerHand::OnePair;
    }

    PokerHand::HighCard
}

pub fn has_flush(cards: &[Card]) -> bool {
    let mut suit_counts: HashMap<Suit, i32> = HashMap::new();

    for card in cards {
        *suit_counts.entry(card.suit).or_default() += 1;
    }

    suit_counts.values().any(|&count| count >= 5)
}

pub fn has_straight(cards: &[Card]) -> bool {
    let mut values: Vec<i32> = cards.iter().map(|card| card.value as i32).collect();
    values.sort_unstable();

    // Remove duplicates
    values.dedup();

    for window in values.windows(5) {
        if window[4] - window[0] == 4 {
            return true;
        }
    }

    // Special case for A-2-3-4-5 straight
    if values.len() >= 5
        && values.contains(&2)
        && values.contains(&3)
        && values.contains(&4)
        && values.contains(&5)
        && values.contains(&14)
    {
        return true;
    }

    false
}

pub fn has_straight_flush(cards: &[Card]) -> bool {
    let _suits = Card::sorted_suits(cards);
    let values = Card::sorted_values(cards);

    if !has_flush(cards) || !has_straight(cards) {
        return false;
    }

    // Create a map of suit to list of values
    let mut values_by_suit: HashMap<Suit, Vec<i32>> = HashMap::new();
    for card in cards {
        values_by_suit
            .entry(card.suit)
            .or_default()
            .push(card.value as i32);
    }

    // Filter suits with at least 5 cards
    let candidates: Vec<&Vec<i32>> = values_by_suit
        .values()
        .filter(|list| list.len() >= 5)
        .collect();

    if candidates.is_empty() {
        return false;
    }

    for candidate in candidates {
        if has_contiguous_subsets_of_length_5(candidate) {
            return true;
        }
    }

    // Check for straight flushes starting with an ace (1)
    let mut candidate_values_with_ace_replaced: Vec<i32> = values
        .iter()
        .map(|&value| if value == 14 { 1 } else { value })
        .collect();

    candidate_values_with_ace_replaced.sort_unstable();
    candidate_values_with_ace_replaced.dedup();

    for window in candidate_values_with_ace_replaced.windows(5) {
        if window[4] - window[0] == 4 {
            return true;
        }
    }

    false
}

fn has_contiguous_subsets_of_length_5(values: &[i32]) -> bool {
    let mut values = values.to_vec();
    values.sort_unstable();

    for window in values.windows(5) {
        if window[4] - window[0] == 4 {
            return true;
        }
    }

    false
}

pub fn has_royal_flush(cards: &[Card]) -> bool {
    let suits = Card::sorted_suits(cards);
    let _values: Vec<i32> = cards.iter().map(|card| card.value as i32).collect();

    // Check for royal flush in each suit
    for &suit in suits.iter() {
        let suit_values: Vec<i32> = cards
            .iter()
            .filter(|&card| card.suit == suit)
            .map(|card| card.value as i32)
            .collect();

        if suit_values.len() >= 5 {
            // Check for royal flush values
            if suit_values.contains(&(Value::Ten as i32))
                && suit_values.contains(&(Value::Jack as i32))
                && suit_values.contains(&(Value::Queen as i32))
                && suit_values.contains(&(Value::King as i32))
                && suit_values.contains(&(Value::Ace as i32))
            {
                return true;
            }
        }
    }

    false
}

pub fn has_pair(cards: &[Card]) -> bool {
    let value_counts = sort_value_counts(cards);
    value_counts.into_iter().any(|count| count >= 2)
}

pub fn has_four_of_a_kind(cards: &[Card]) -> bool {
    let value_counts = sort_value_counts(cards);
    value_counts.into_iter().any(|count| count >= 4)
}

pub fn has_full_house(cards: &[Card]) -> bool {
    let value_counts = sort_value_counts(cards);

    // Check for a full house: one set of three and one set of two
    let mut has_three_of_a_kind = false;
    let mut has_pair = false;

    for count in value_counts {
        if count == 3 {
            has_three_of_a_kind = true;
        } else if count == 2 {
            has_pair = true;
        }

        if has_three_of_a_kind && has_pair {
            return true;
        }
    }

    false
}

pub fn has_three_of_a_kind(cards: &[Card]) -> bool {
    let value_counts = sort_value_counts(cards);
    value_counts.into_iter().any(|count| count == 3)
}

pub fn has_two_pair(cards: &[Card]) -> bool {
    let value_counts = sort_value_counts(cards);

    // Check for two pairs
    let pair_count = value_counts.iter().filter(|&&count| count >= 2).count();
    pair_count >= 2
}
