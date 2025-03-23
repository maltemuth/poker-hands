use crate::card::Card;
use std::collections::HashMap;

pub fn numerical_sort(a: &i32, b: &i32) -> std::cmp::Ordering {
    a.cmp(b)
}

pub fn sort_value_counts(cards: &[Card]) -> Vec<i32> {
    let mut value_counts: HashMap<i32, i32> = HashMap::new();

    for card in cards {
        *value_counts.entry(card.value as i32).or_default() += 1;
    }

    let mut counts: Vec<i32> = value_counts.into_values().collect();
    counts.sort_by(|a, b| b.cmp(a)); // Sort in descending order

    counts
}
